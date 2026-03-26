import { Controller, Post, Body } from '@nestjs/common';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @Post('chat')
    async chat(@Body('message') message: string) {
        if (!message) {
            return { error: 'Message is required' };
        }
        return this.movieService.chat(message);
    }
}
