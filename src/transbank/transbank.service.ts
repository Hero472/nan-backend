import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
const WebpayPlus = require('transbank-sdk').WebpayPlus;

@Injectable()
export class TransbankService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  echo = async (payload: any) => {
    const message = 'this is the response from transbank service';
    return { message, payload };
  };

  createTransaction = async (request: {
    sessionId?: string;
    amount?: number;
    protocol?: string;
    host?: string;
  }) => {
    const buyOrder = 'O-' + Math.floor(Math.random() * 10000) + 1;
    const sessionId = request.sessionId
      ? request.sessionId
      : 'S-' + Math.floor(Math.random() * 10000) + 1;
    const amount = request.amount || Math.floor(Math.random() * 1000) + 1001;
    const returnUrl =
      request.protocol + '://' + request.host + '/payment/webpay_plus/commit';

    const createResponse = await new WebpayPlus.Transaction().create(
      buyOrder,
      sessionId,
      amount,
      returnUrl,
    );

    const token = createResponse.token;
    const url = createResponse.url;

    const viewData = {
      buyOrder,
      sessionId,
      amount,
      returnUrl,
      token,
      url,
    };

    return viewData;
  };

  commitTransaction = async (request: { method: string; query: any; body: any; }) => {
    //Flujos:
    //1. Flujo normal (OK): solo llega token_ws
    //2. Timeout (más de 10 minutos en el formulario de Transbank): llegan TBK_ID_SESION y TBK_ORDEN_COMPRA
    //3. Pago abortado (con botón anular compra en el formulario de Webpay): llegan TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
    //4. Caso atipico: llega todos token_ws, TBK_TOKEN, TBK_ID_SESION, TBK_ORDEN_COMPRA
    console.log(
      '================================================================================',
    );
    console.log(request);
    console.log(
      '================================================================================',
    );
    const params = request.method === 'GET' ? request.query : request.body;

    const token = params.token_ws;
    const tbkToken = params.TBK_TOKEN;
    const tbkOrdenCompra = params.TBK_ORDEN_COMPRA;
    const tbkIdSesion = params.TBK_ID_SESION;

    //let step = null;
    //let stepDescription = null;
    const viewData = {
      token,
      tbkToken,
      tbkOrdenCompra,
      tbkIdSesion,
    };

    if (token && !tbkToken) {
      //Flujo 1
      const commitResponse = await new WebpayPlus.Transaction().commit(token);
      const viewData = {
        token,
        commitResponse,
      };

      const newTransaction = this.transactionRepository.create(viewData);
      const savedTransaction =
        await this.transactionRepository.save(newTransaction);

      return savedTransaction;
    } else if (!token && !tbkToken) {
      //Flujo 2
      // step = 'El pago fue anulado por tiempo de espera.';
      //stepDescription =
        'En este paso luego de anulación por tiempo de espera (+10 minutos) no es necesario realizar la confirmación ';
    } else if (!token && tbkToken) {
      //Flujo 3
      //step = 'El pago fue anulado por el usuario.';
      //stepDescription =
        'En este paso luego de abandonar el formulario no es necesario realizar la confirmación ';
    } else if (token && tbkToken) {
      //Flujo 4
      //step = 'El pago es inválido.';
      //stepDescription =
        'En este paso luego de abandonar el formulario no es necesario realizar la confirmación ';
    }

    return ['Ocurrio un error!', viewData];
  };

  statusTransaction = async (
    token: string,
  ): Promise<{ token: string; statusResponse: any }> => {
    const statusResponse = await new WebpayPlus.Transaction().status(token);

    const viewData = {
      token,
      statusResponse,
    };

    return viewData;
  };

  refundTransaction = async (token: string, amount: string) => {
    const refundResponse = await new WebpayPlus.Transaction().refund(
      token,
      amount,
    );

    const viewData = {
      token,
      amount,
      refundResponse,
    };

    return viewData;
  };

  getTransactionbyToken = async (token: string) => {
    const transaction = await this.transactionRepository.findOne({
      where: {
        token,
      },
      relations: ['commitResponse'],
    });

    console.log(transaction);
    return transaction ? transaction : 'Token no encontrado';
  };
}

