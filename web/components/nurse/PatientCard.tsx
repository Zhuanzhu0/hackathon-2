import Link from "next/link";
import { Activity, AlertTriangle, Clock, User } from "lucide-react";
import { type Patient } from "@/lib/mock-data";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PatientCardProps {
    patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps) {
    const statusColor =
        patient.status === "Stable"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
            : patient.status === "Warning"
                ? "bg-yellow-500/10 text-yellow-600 border-yellow-200 animate-pulse"
                : "bg-red-500/10 text-red-600 border-red-200 animate-pulse";

    const borderColor =
        patient.status === "Stable"
            ? "border-l-emerald-500"
            : patient.status === "Warning"
                ? "border-l-yellow-500"
                : "border-l-red-500";

    return (
        <Link href={`/nurse/patient/${patient.id}`}>
            <Card className={`hover:shadow-lg transition-all border-l-4 ${borderColor}`}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex flex-col">
                        <span className="font-bold text-lg">{patient.name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3" /> {patient.age}y • {patient.gender}
                        </span>
                    </div>
                    <Badge className={`${statusColor} hover:${statusColor}`}>
                        {patient.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                        <div className="flex flex-col">
                            <span className="text-slate-500 text-xs">Ward/Bed</span>
                            <span className="font-medium">
                                {patient.ward} - {patient.bed}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-slate-500 text-xs">HR / SpO2</span>
                            <span className="font-medium flex items-center gap-1">
                                <Activity className="w-3 h-3 text-slate-400" />
                                {patient.vitals.heartRate} / {patient.vitals.spo2}%
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Updated now
                    </div>
                    {patient.alerts.length > 0 && (
                        <div className="flex items-center gap-1 text-red-500 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            {patient.alerts.length} Alert(s)
                        </div>
                    )}
                </CardFooter>
            </Card>
        </Link>
    );
}
