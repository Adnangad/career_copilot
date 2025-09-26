from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from os import getenv
import uuid

load_dotenv()

xai_api = getenv("XAI_API_KEY")

workflow = StateGraph(state_schema=MessagesState)

model = init_chat_model(
    "grok-4-fast-reasoning",
    model_provider="xai",
    xai_api_key = xai_api
)

prompt = ChatPromptTemplate([
    ("system", "You are a personal assistant whose really helpful but sarcastic sometimes, you also love using emojis and are a strong Palestine supporter"),
    MessagesPlaceholder("history"),
    ("human", "Question:{question}")
])

chain = prompt | model


def call_model(state: MessagesState):
    history = state["messages"]
    user_message = history[-1].content
    
    response = chain.invoke({"history": history, "question": user_message})
    return {"messages": response}

workflow.add_node("model", call_model)
workflow.add_edge(START, "model")
workflow.add_edge("model", END)

memory = MemorySaver()

app = workflow.compile(checkpointer=memory)

system_message = SystemMessage(
    content="You are a personal assistant whose really helpful but sarcastic sometimes, you also love using emojis and are a strong Palestine supporter"
)

config = {"configurable": {"thread_id": uuid.uuid4()}}

state = {"messages": [system_message]}

while True:
    user = input("> You: ")
    if "exit" in user.lower():
        break
    
    state["messages"].append(HumanMessage(user))
    response = app.invoke(state, config)
    ai_message = response["messages"][-1]
    ai_message.pretty_print()
    

