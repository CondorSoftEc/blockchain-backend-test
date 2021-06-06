import {Body, Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {CreateAssetDto} from "./services/dto/createAssetDto";
import {Asset} from "./services/models/asset";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('assets')
    getAssets(): Promise<any> {
        return this.appService.getAssets();
    }

    @Post('assets/new')
    postAssets(@Body() createAssetDto: CreateAssetDto): Promise<any> {

        console.log(createAssetDto);
        // this.appService.postAsset();
        return this.appService.postAsset({...createAssetDto} as Asset);
    }

}
