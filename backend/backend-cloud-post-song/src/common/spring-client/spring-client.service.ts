import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpringClientService {
    private readonly base = process.env.SPRING_URL ?? 'http://api-students:8080';

    constructor(private readonly http: HttpService) {}
  
    async getAllHilos() {
      const { data } = await firstValueFrom(
        this.http.get(`${this.base}/api/hilos`)   // ajusta la ruta
      );
      return data;              // espera un array JSON
    }
}
