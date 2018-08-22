export interface PatientKitData {
    reason: string,
    quantity: string,
}

export interface PatientKitStep {
    visit(data: PatientKitData);
}