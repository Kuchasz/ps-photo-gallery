import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { Client } from "./Client";

@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field()
    @PrimaryColumn()
    imageId: string;

    @Column({nullable: false})
    clientId: number;

    @ManyToOne(type => Client)
    client: Client;

    @Field()
    @PrimaryColumn()
    galleryId: string;
}
