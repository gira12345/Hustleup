import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AdminDashboardKPIs({ kpis }) {
  return (
    <div className="py-5">
      <Container>
        <Row className="justify-content-center g-4">
          {/* Card 1 */}
          <Col xs="auto">
            <div
              className="rounded-3xl shadow-lg bg-[rgb(15,30,54)] w-40 h-40 text-white flex flex-col items-center justify-center text-center transition-all hover:scale-105"
            >
              <div className="mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-users text-white">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-300 mb-1">Total de Utilizadores</p>
              <p className="text-2xl font-extrabold">{kpis?.totalUtilizadores ?? '-'}</p>
            </div>
          </Col>

          {/* Card 2 */}
          <Col xs="auto">
            <div
              className="rounded-3xl shadow-lg bg-[rgb(15,30,54)] w-40 h-40 text-white flex flex-col items-center justify-center text-center transition-all hover:scale-105"
            >
              <div className="mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-file-clock text-white">
                  <path d="M14.5 2v6a2 2 0 0 0 2 2h6" />
                  <path d="M16.5 22h-9A2.5 2.5 0 0 1 5 19.5v-15A2.5 2.5 0 0 1 7.5 2h7l6 6v11.5A2.5 2.5 0 0 1 18.5 22z" />
                  <circle cx="12" cy="16" r="3" />
                  <path d="M12 14v2l1 1" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-300 mb-1">Propostas Pendentes</p>
              <p className="text-2xl font-extrabold">{kpis?.propostasPendentes ?? '-'}</p>
            </div>
          </Col>

          {/* Card 3 */}
          <Col xs="auto">
            <div
              className="rounded-3xl shadow-lg bg-[rgb(15,30,54)] w-40 h-40 text-white flex flex-col items-center justify-center text-center transition-all hover:scale-105"
            >
              <div className="mb-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="lucide lucide-building text-white">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 3v4" />
                  <path d="M8 3v4" />
                  <path d="M3 17h18" />
                  <path d="M12 12v5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-300 mb-1">Empresas Pendentes</p>
              <p className="text-2xl font-extrabold">{kpis?.empresasPendentes ?? '-'}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboardKPIs;
