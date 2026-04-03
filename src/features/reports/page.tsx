import React, {useState} from "react";
import {KpiMetrics} from './components/types';
import {getKpiDataByDays} from './components/data';
import Header from "@/features/reports/components/Header.tsx";
import DatePicker from "@/features/reports/components/DatePicker.tsx";
import KPIGrid from "@/features/reports/components/KPIGrid.tsx";
import MemberPanel from "@/features/reports/components/MemberPanel.tsx";
import DonutStatus from "@/features/reports/components/DonutStatus.tsx";
import VelocityChart from "@/features/reports/components/VelocityChart.tsx";
import OverdueTasks from "@/features/reports/components/OverdueTasks.tsx";

export const ReportPage: React.FC = () => {
    const [kpiMetrics, setKpiMetrics] = useState<KpiMetrics>(getKpiDataByDays(30));

    const handleRangeChange = (start: Date | null, end: Date | null, days: number) => {
        const newMetrics = getKpiDataByDays(days);
        setKpiMetrics(newMetrics);
    };

    return (
        <>
            <div className="bg-orbs">
                <div className="orb orb-blue"></div>
                <div className="orb orb-green"></div>
                <div className="orb orb-purple"></div>
                <div className="orb orb-pink"></div>
            </div>

            <div className="page">
                <Header/>

                <div className="page-title-row">
                    <div className="page-title">
                        <h1>Rendimiento del Equipo</h1>
                        <p>Vista general de tareas, estados y contribuciones individuales</p>
                    </div>
                    <DatePicker onRangeChange={handleRangeChange}/>
                </div>

                <KPIGrid metrics={kpiMetrics}/>

                <div className="main-grid fade-up d1">
                    <MemberPanel/>
                    <DonutStatus metrics={kpiMetrics}/>
                </div>

                <div className="bottom-grid fade-up d2">
                    <VelocityChart/>
                    <OverdueTasks/>
                </div>
            </div>
        </>
    );
};