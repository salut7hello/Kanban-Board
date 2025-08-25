import Dexie, { type Table } from 'dexie';
export interface Board {
  id ?: number ;
  title: string;
  createdAt: Date;
}

export interface Column {
    id ?: number ;
    boardId : number;
    title : string;
    order : number
    
}

export interface Card {
    id ?: number ;
    columnId : number  ;
    title : string ;
    description ?: string ;
    dueDate ?: Date ;
    done ?: boolean;
    order : number
}
// ---- Dexie DB ----
export const db = new Dexie('KanbanDatabase') as Dexie & {
  Board: Table< Board,number>;
  Column : Table < Column, number>;
  Card : Table <Card ,number>


};

// Schema declaration:
db.version(1).stores({
  Board: '++id, title, createdAt',
  Column : '++id, boardId, order',
  Card : '++id, columnId, order , dueDate' 

});
