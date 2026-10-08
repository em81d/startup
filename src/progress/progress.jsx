import React from 'react';

export function Progress() {
  return (
    <main className="page">
      <h2>Progress</h2>

      <details className="card collapsible mt-6">
        <summary className="collapsible-summary"><h3>Words you know</h3></summary>
        <div className="table-scroll mt-4">
          <table className="vocab-table">
            <thead>
              <tr>
                <th>Spanish</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>hola</td>
                <td>hello</td>
              </tr>
              <tr>
                <td>adiós</td>
                <td>goodbye</td>
              </tr>
              <tr>
                <td>gracias</td>
                <td>thank you</td>
              </tr>
              <tr>
                <td>por favor</td>
                <td>please</td>
              </tr>
              <tr>
                <td>sí</td>
                <td>yes</td>
              </tr>
              <tr>
                <td>no</td>
                <td>no</td>
              </tr>
              <tr>
                <td>el agua</td>
                <td>water</td>
              </tr>
              <tr>
                <td>la comida</td>
                <td>food</td>
              </tr>
              <tr>
                <td>la casa</td>
                <td>house</td>
              </tr>
              <tr>
                <td>el perro</td>
                <td>dog</td>
              </tr>
              <tr>
                <td>el gato</td>
                <td>cat</td>
              </tr>
              <tr>
                <td>el libro</td>
                <td>book</td>
              </tr>
              <tr>
                <td>grande</td>
                <td>big</td>
              </tr>
              <tr>
                <td>pequeño</td>
                <td>small</td>
              </tr>
              <tr>
                <td>bueno</td>
                <td>good</td>
              </tr>
              <tr>
                <td>malo</td>
                <td>bad</td>
              </tr>
              <tr>
                <td>hablar</td>
                <td>to speak</td>
              </tr>
              <tr>
                <td>comer</td>
                <td>to eat</td>
              </tr>
              <tr>
                <td>beber</td>
                <td>to drink</td>
              </tr>
              <tr>
                <td>vivir</td>
                <td>to live</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <details className="card collapsible mt-6" open>
        <summary className="collapsible-summary"><h3>Words you are learning</h3></summary>
        <div className="table-scroll mt-4">
          <table className="vocab-table">
            <thead>
              <tr>
                <th>Spanish</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>el maestro</td>
                <td>teacher</td>
              </tr>
              <tr>
                <td>el médico</td>
                <td>doctor</td>
              </tr>
              <tr>
                <td>el abogado</td>
                <td>lawyer</td>
              </tr>
              <tr>
                <td>la enfermera</td>
                <td>nurse</td>
              </tr>
              <tr>
                <td>el cocinero</td>
                <td>cook</td>
              </tr>
              <tr>
                <td>el bombero</td>
                <td>firefighter</td>
              </tr>
              <tr>
                <td>el trabajo</td>
                <td>job</td>
              </tr>
              <tr>
                <td>la empresa</td>
                <td>company</td>
              </tr>
              <tr>
                <td>la reunión</td>
                <td>meeting</td>
              </tr>
              <tr>
                <td>el sueldo</td>
                <td>salary</td>
              </tr>
              <tr>
                <td>ayer</td>
                <td>yesterday</td>
              </tr>
              <tr>
                <td>anoche</td>
                <td>last night</td>
              </tr>
              <tr>
                <td>la semana pasada</td>
                <td>last week</td>
              </tr>
              <tr>
                <td>fui</td>
                <td>I went</td>
              </tr>
              <tr>
                <td>hice</td>
                <td>I did</td>
              </tr>
              <tr>
                <td>tuve</td>
                <td>I had</td>
              </tr>
              <tr>
                <td>trabajé</td>
                <td>I worked</td>
              </tr>
              <tr>
                <td>estudié</td>
                <td>I studied</td>
              </tr>
              <tr>
                <td>aprender</td>
                <td>to learn</td>
              </tr>
              <tr>
                <td>enseñar</td>
                <td>to teach</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <details className="card collapsible mt-6">
        <summary className="collapsible-summary"><h3>Future vocab</h3></summary>
        <div className="table-scroll mt-4">
          <table className="vocab-table">
            <thead>
              <tr>
                <th>Spanish</th>
                <th>English</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>el ingeniero</td>
                <td>engineer</td>
              </tr>
              <tr>
                <td>el contador</td>
                <td>accountant</td>
              </tr>
              <tr>
                <td>el arquitecto</td>
                <td>architect</td>
              </tr>
              <tr>
                <td>el periodista</td>
                <td>journalist</td>
              </tr>
              <tr>
                <td>el carpintero</td>
                <td>carpenter</td>
              </tr>
              <tr>
                <td>el agricultor</td>
                <td>farmer</td>
              </tr>
              <tr>
                <td>la entrevista</td>
                <td>interview</td>
              </tr>
              <tr>
                <td>el horario</td>
                <td>schedule</td>
              </tr>
              <tr>
                <td>el ascenso</td>
                <td>promotion</td>
              </tr>
              <tr>
                <td>la jubilación</td>
                <td>retirement</td>
              </tr>
              <tr>
                <td>el desarrollo</td>
                <td>development</td>
              </tr>
              <tr>
                <td>la investigación</td>
                <td>research</td>
              </tr>
              <tr>
                <td>el presupuesto</td>
                <td>budget</td>
              </tr>
              <tr>
                <td>la herramienta</td>
                <td>tool</td>
              </tr>
              <tr>
                <td>el taller</td>
                <td>workshop</td>
              </tr>
              <tr>
                <td>emprender</td>
                <td>to undertake</td>
              </tr>
              <tr>
                <td>lograr</td>
                <td>to achieve</td>
              </tr>
              <tr>
                <td>resolver</td>
                <td>to solve</td>
              </tr>
              <tr>
                <td>dirigir</td>
                <td>to manage</td>
              </tr>
              <tr>
                <td>contratar</td>
                <td>to hire</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

    </main>

  );
}