import { Field, Int, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Client } from "./Client";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field()
    @PrimaryColumn()
    imageId: string;

    @PrimaryColumn()
    clientId: number;

    @ManyToOne(type => Client)
    client: Client;

    @PrimaryColumn()
    galleryId: string;

    @Field()
    liked: boolean;

    @Field(type => Int)
    likes: number;
}
