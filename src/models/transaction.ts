import mongoose, { Schema } from "mongoose";

export interface ITransaction extends mongoose.Document {
  date: Date;
  description: string;
  amount: number;
  type: "Credit" | "Debit";
}

const transactionSchema: Schema<ITransaction> = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Credit", "Debit"],
    required: true,
  },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", transactionSchema);