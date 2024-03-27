from typing import Union
from fastapi import FastAPI, HTTPException
import schedule
import threading
import time
import subprocess

app = FastAPI()

# Lista para armazenar os agendamentos
agendamentos = []


def agendar_aplicacao(nome: str, horario: str, frequencia: str):
    # Função para agendar a aplicação
    def job():
        print(f"Executando {nome} às {horario}")

        # Executa a aplicação como um subprocesso
        subprocess.Popen(["python", f"C:/Users/samue/Documents/Teste/{nome}.py"])

    # Converte o horário para o formato de 24 horas
    hora, minuto = map(int, horario.split(':'))
    horario = f"{hora:02d}:{minuto:02d}"

    # Agenda a aplicação com base na frequência
    if frequencia == "diariamente":
        schedule.every().day.at(horario).do(job)
    elif frequencia == "semanalmente":
        schedule.every().week.at(horario).do(job)
    elif frequencia == "mensalmente":
        schedule.every().month.at(horario).do(job)
    else:
        raise HTTPException(status_code=400, detail="Frequência inválida")

    # Adiciona o agendamento à lista
    agendamentos.append({"nome": nome, "horario": horario, "frequencia": frequencia})


# Função para executar o agendador em segundo plano
def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)


# Inicia o agendador em uma thread separada
scheduler_thread = threading.Thread(target=run_scheduler)
scheduler_thread.start()


@app.post("/agendar/")
def agendar_aplicacao_endpoint(nome: str, horario: str, frequencia: str):
    agendar_aplicacao(nome, horario, frequencia)
    return {"mensagem": "Aplicação agendada com sucesso"}


@app.get("/listar_agendamentos/")
def listar_agendamentos():
    return agendamentos
