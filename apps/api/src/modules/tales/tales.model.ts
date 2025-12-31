import {Schema, model, type InferSchemaType} from "mongoose";

const taleSchema = new Schema({
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },
  title: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  visitedLocation: {
    type: [String],
    default: []
  },
  isFav: {
    type: Boolean,
    default: false
  },
  imgUrl: {
    type: [String],
    required: true
  },
  visitedDate: {
    type: Date,
    required: true
  }
},
{
  timestamps: true,
  versionKey: false,
});

export type Tale = InferSchemaType<typeof taleSchema>;
export const TaleModel = model<Tale>("Tale", taleSchema)