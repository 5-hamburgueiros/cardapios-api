import { binding, then, when, before, after } from 'cucumber-tsflow';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../src/modules/app/app.module';
import { INestApplication } from '@nestjs/common';
import { strict as assert } from 'assert';

class Context {
  public app: INestApplication;
  public response;
}

// tslint:disable-next-line:max-classes-per-file
@binding([Context])
export class IngredientesSteps {
  constructor(protected context: Context) {}

  @before()
  public async criaNest(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.context.app = moduleFixture.createNestApplication();
    await this.context.app.init();
  }

  @when(/realizo uma requisição GET para "([^"]*)"/)
  public async requisicao(url: string) {
    this.context.response = await request(this.context.app.getHttpServer()).get(url);
  }

  @then(/o código da resposta deve ser "(\d{3})"/)
  public codigoStatusResposta(status: string) {
    assert.equal(this.context.response.status, parseInt(status));
  }

  @then(/a resposta deve conter mais de um item/)
  public maisDeUmItemNaResposta() {
    assert(this.context.response.body.items.length > 1, `Qtd de items: ${this.context.response.body.items.length}`)
  }

  @after()
  public async fechaNest() {
    await this.context.app.close();
  }
}