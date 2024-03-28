import React, { useState, useEffect } from 'react';

function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [nome, setNome] = useState('');
  const [horario, setHorario] = useState('');
  const [frequencia, setFrequencia] = useState('');
  const [mensagem, setMensagem] = useState('');

  // Função para listar os agendamentos
  const listarAgendamentos = async () => {
    try {
      const response = await fetch('http://localhost:8000/listar_agendamentos/');
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao listar os agendamentos:', error);
    }
  };

  // Função para agendar uma aplicação
  const agendarAplicacao = async () => {
    try {
      const response = await fetch('http://localhost:8000/agendar/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, horario, frequencia }),
      });
      const data = await response.json();
      setMensagem(data.mensagem);
      // Atualiza a lista de agendamentos após agendar uma aplicação
      listarAgendamentos();
    } catch (error) {
      console.error('Erro ao agendar a aplicação:', error);
    }
  };

  useEffect(() => {
    // Lista os agendamentos ao carregar o componente
    listarAgendamentos();
  }, []);

  return (
    <div>
      <h1>Agendador de Aplicações</h1>
      <div>
        <h2>Agendar Nova Aplicação</h2>
        <input type="text" placeholder="Nome da aplicação" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="text" placeholder="Horário (HH:MM)" value={horario} onChange={(e) => setHorario(e.target.value)} />
        <select value={frequencia} onChange={(e) => setFrequencia(e.target.value)}>
          <option value="">Selecione a frequência</option>
          <option value="diariamente">Diariamente</option>
          <option value="semanalmente">Semanalmente</option>
          <option value="mensalmente">Mensalmente</option>
        </select>
        <button onClick={agendarAplicacao}>Agendar</button>
        {mensagem && <p>{mensagem}</p>}
      </div>
      <div>
        <h2>Lista de Agendamentos</h2>
        <ul>
          {agendamentos.map((agendamento, index) => (
            <li key={index}>{`${agendamento.nome} - ${agendamento.horario} - ${agendamento.frequencia}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
