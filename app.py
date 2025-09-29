from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain.prompts import ChatPromptTemplate
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import sessionmaker, Session
from os import getenv
from promptz import system
from upstash_redis import Redis
from langchain.chat_models import init_chat_model

load_dotenv()

xai_api = getenv("XAI_API_KEY")
redis_url = getenv("UPSTASH_REDIS_REST_URL")
redis_token = getenv("UPSTASH_REDIS_REST_TOKEN")
db_url = getenv("psql")

# FastAPI app setup
app = FastAPI()

# Redis setup
redis = Redis(url=redis_url, token=redis_token)

# Database setup
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = automap_base()
Base.prepare(engine, reflect=True)
Jobs = Base.classes.jobs

# LangChain model + prompt setup
model = init_chat_model(
    "grok-4-fast-reasoning",
    model_provider="xai",
    xai_api_key=xai_api
)
prompt = ChatPromptTemplate([
    ("system", f"{system}"),
    ("human", "Generate a cover letter based on this job description:{question} and tailor it using my resume: {resume}")
])
chain = prompt | model


def get_db():
    db_op = SessionLocal()
    try:
        yield db_op
    finally:
        db_op.close()

# Fetches resume
def get_resume(thread_id):
    resume = redis.get(f"resume:{thread_id}")
    if not resume:
        raise Exception("No Resume Found")
    if isinstance(resume, bytes):
        resume = resume.decode("utf-8")
    return resume


def call_model(state: MessagesState):
    history = state.get("messages", [])
    user_message = history[-1].content if history else ""
    resume = state.get("resume", "")

    response = chain.invoke({
        "question": user_message,
        "resume": resume
    })
    return response


workflow = StateGraph(state_schema=MessagesState)
workflow.add_node("model", call_model)
workflow.add_edge(START, "model")
workflow.add_edge("model", END)

memory = MemorySaver()
workflow_app = workflow.compile(checkpointer=memory)



@app.post("/generate_cover_letter")
def generate_cover(thread_id: str, jobId: int, db: Session = Depends(get_db)):
    try:
        config = {"configurable": {"thread_id": thread_id}}
        job = db.query(Jobs).filter_by(id=jobId).first()
        if not job:
            return {"status": 404, "message": "Job not found"}

        resume = get_resume(thread_id)
        state = {
            "messages": [HumanMessage(content=job.description)],
            "thread_id": thread_id,
            "resume": resume
        }

        response = workflow_app.invoke(state, config)
        ai_message = response["messages"][-1]

        return {"status": 200, "message": "Success", "letter": ai_message.content}
    except Exception as e:
        print("AN ERROR OCCURED WHILE GENERATING CV", e)
        return {"status": 500, "message": "Error, Unable to generate cover letter at this time"}
