import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { Like } from "../entities/like";

@Resolver()
export class LikeResolver {
    @Mutation(() => Like)
    likeImage(@Arg("imageId") imageId: string, @Arg("clientId", () => Int) clientId: number, @Arg("galleryId") galleryId: string) {
        const like = new Like();
        like.imageId = imageId;
        like.clientId = clientId;
        like.galleryId = galleryId;
        return like.save();
    }

    @Query(() => [Like])
    likes(@Arg("galleryId") galleryId: string) {
        return Like.find({ galleryId });
    }
}