import { TableDefinition } from "cucumber";

type HashTable = {[colname:string]:string;}[];

export class Shipment {

    name: string;
    type: string;
    id: number;
    destination: string;
    source: string;
    contents: Array<Kit>;

    constructor (type: string, name: string, destination: string, source: string) {
        this.type = type;
        this.name = name;
        this.destination = destination;
        this.source = source;
        this.contents = [];
    }

    static async create(inputTable: TableDefinition | HashTable): Promise<Shipment> {
        let table: TableDefinition | HashTable;
        if('raw' in inputTable) {
            table = (inputTable as TableDefinition).hashes();
        } else {
            table = (inputTable as HashTable);
        }
        let shipment: Shipment = new Shipment(table[0].type, table[0].name , table[0].destination, table[0].source);
        for(let i = 0; i < table.length; i++) {
            shipment.contents.push(new Kit(table[i].kit, table[i].lot, table[i].quantity));
        }
        return shipment;
    }
}

export class Shipments {
    list: Array<Shipment>;
    constructor() {
        this.list = [];
    }
    static async create(tableDef: TableDefinition): Promise<Shipments> {
        let table = tableDef.hashes();
        let shipments: Shipments = new Shipments();
        let finished: boolean = false;
        while(!finished) {
            let subTable: HashTable;
            for(let i = 1; i <= table.length; i++) {
                let entry = table[i];
                if(i == table.length) {
                    subTable = table.splice(0, i);
                    finished = true;
                } else if(entry.destination) {
                    subTable = table.splice(0,i);
                    break;
                }
            }
            shipments.list.push(await Shipment.create(subTable));
        }
        return shipments;
    } 
    public async getWithName(name: string): Promise<Shipment> {
        for(let s of this.list) {
            if(s.name === name) {
                return s;
            }
        }
        throw Error("Could not match name " + name);
    }
}

export class Kit {
    name: string;
    lot: string;
    quantity: number;
    constructor(name: string, lot: string, quantity: string) {
        this.name = name;
        this.lot = lot;
        this.quantity = Number(quantity);
    }
}