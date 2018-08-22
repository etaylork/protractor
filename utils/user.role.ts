
export class UserRole{
    name: string;
    email: string;
    password: string;
    unblinded: boolean = true;

    constructor(name: string, email: string, password: string, unblinded?: boolean) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.unblinded = unblinded; 
    }

    public static getUser(name: string) {
        for(let i in this.roles) {
            if(this.roles[i].name.indexOf(name) !== -1) {
                return this.roles[i];
            }
        }
    }

    public static roles = {
        Admin: new UserRole("admin", "admin@4gclinical.com", "admin",true),
        Administrator: new UserRole("super user", "superuser@4gclinical.com", "superuser",true),
        ClientExcellence: new UserRole("Client Excellence","ce@4gclinical.com","QA4th!Gen",false),
        CSL: new UserRole("CSL", "csl@4gclinical.com", "QA4th!Gen",true),
        DepotManager: new UserRole("Depot Manager", "dm@4gclinical.com", "QA4th!Gen",true),
        MedicalMonitor: new UserRole("Medical Monitor", "mm@4gclinical.com", "QA4th!Gen",true),
        Pharmacist: new UserRole("Pharmacist", "tp@4gclinical.com", "QA4th!Gen"),
        PrincipalInvestigator: new UserRole("Principal Investigator", "si@4gclinical.com","QA4th!Gen",false),
        SafetyManager: new UserRole("Safety Unblinder", "su@4gclinical.com", "QA4th!Gen",true),
        SiteMonitor: new UserRole("Site Monitor", "smon@4gclinical.com", "QA4th!Gen",false),
        SitePharmacist: new UserRole("Site Pharmacist", "sp@4gclinical.com", "QA4th!Gen"),
        StudyCoordinator: new UserRole("Study Coordinator", "sc@4gclinical.com", "QA4th!Gen",false),
        StudyManager: new UserRole("Study Manager", "sm@4gclinical.com", "QA4th!Gen",false),
        SuperUser: new UserRole("super user", "superuser@4gclinical.com", "superuser",true),
        SupplyManager: new UserRole("Supply Manager", "sup@4gclinical.com", "QA4th!Gen",true),
        ThirdPartyUnblindedDispensing: new UserRole("3P Unblinded Dispensing", "tp@4gclinical.com", "QA4th!Gen",true),
        UnblindedInvestigator: new UserRole("Unblinded Investigator","upi@4gclinical.com","QA4th!Gen",true)
    };
}
