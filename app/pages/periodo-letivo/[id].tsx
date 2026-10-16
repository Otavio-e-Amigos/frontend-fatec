import { Link } from "react-router";
import Header from "~/layouts/Header";
import type PeriodoLetivo from "~/modules/periodo-letivo/periodo-letivo.class";
import formatPeriodoDate from "~/modules/periodo-letivo/format-date";

export default function PeriodoLetivoDetailsPage({ periodo }: { periodo: PeriodoLetivo }) {
  return (
    <div className="flex flex-1 flex-col">
      <Header activeItem="Períodos" />
      <main className="m-5 flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          Período Letivo {periodo.ano}/{periodo.semestre}
        </h1>
        <div className="flex flex-col gap-2">
          <p>
            <b>Ano:</b> {periodo.ano}
          </p>
          <p>
            <b>Semestre:</b> {periodo.semestre}º Semestre
          </p>
          <p>
            <b>Data de Início:</b> {formatPeriodoDate(periodo.dataInicio)}
          </p>
          <p>
            <b>Data de Fim:</b> {formatPeriodoDate(periodo.dataFim)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn" to={`/periodo-letivo/${periodo.id}/edit`}>
            Editar período
          </Link>
          <Link className="btn" data-variant="outline" to="/periodo-letivo">
            Voltar para lista
          </Link>
        </div>
      </main>
    </div>
  );
}
