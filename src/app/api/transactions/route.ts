'use server'
import connectDb from "@/lib/mongodb";
import Transaction,{ITransaction} from "@/models/transaction";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDb();
    const transcations: ITransaction[] = await Transaction.find().sort({ date: -1 });
    console.log(transcations);
    return NextResponse.json(JSON.stringify(transcations), { status: 200 });
}

export async function POST(req: Request){
    await connectDb();
    const { type, amount, date, description } = await req.json();
    const transaction: ITransaction = new Transaction({
        type,
        amount,
        date,
        description,
    });
    await transaction.save();
    return NextResponse.json(JSON.stringify(transaction), { status: 201 });
}
