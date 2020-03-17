import 'jest'
import * as request from 'supertest'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment'
import { response } from 'express'

const address: string = (<any>global).address
let tokenAuth: string
const dateNow: string  = new Date().toISOString()
let userTest: any
let chatTest: any

beforeAll( async () => {
  const token = jwt.sign({ sub: 'usuario@teste.com', iss: environment.security.iss }, environment.security.apiSecret)
  tokenAuth = `Bearer ${token}`

  await request(address)
    .post('/users')
    .send({
      'nickName': 'livia.lobo',
      'email': 'livia.lobo@teste.com',
      'birthDay': dateNow
    })
    .then(response => {
      userTest = response.body
    })

    await request(address)
      .post('/chats')
      .send({
        'chatName': 'chat-livia'
      })
      .then(response => {
        chatTest = response.body
      })
})

test('get /historics', () => {
  return request(address)
    .get('/historics')
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('get /historics - not authorized', () => {
  return request(address)
    .get('/historics')
    .then(response => {
      expect(response.status).toBe(403)
    }).catch(fail)
})

test('post /historics', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'chat': chatTest._id,
      'user': userTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.chat).toBe(chatTest._id)
      expect(response.body.user).toBe(userTest._id)
      expect(response.body.message).toBe('Olá, tudo bem?')
    }).catch(fail)
})

test('post /historics - chat id required', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'user': userTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeInstanceOf(Array)
      expect(response.body.errors[0].message).toContain('chat')
    })
    .catch(fail)
})

test('post /historics - user id required', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'chat': chatTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeInstanceOf(Array)
      expect(response.body.errors[0].message).toContain('user')
    })
    .catch(fail)
})

test('get /historics/aaaaa - not found', () => {
  return request(address)
    .get('/historics/aaaaa')
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('get /historics/:id', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'chat': chatTest._id,
      'user': userTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => 
      request(address)
      .get(`/historics/${response.body._id}`)
      .set('Authorization', tokenAuth))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.chat).toBe(chatTest._id)
      expect(response.body.user.nickName).toBe(userTest.nickName)
      expect(response.body.message).toBe('Olá, tudo bem?')
    }).catch(fail)
})

test('delete /historics/aaaaa - not found', () => {
  return request(address)
    .delete(`/historics/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('delete /historics:/id', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'chat': chatTest._id,
      'user': userTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => 
      request(address)
      .delete(`/historics/${response.body._id}`)
      .set('Authorization', tokenAuth))
    .then(response => {
      expect(response.status).toBe(204)
    }).catch(fail)

})

test('patch /historics/aaaaa - not found', () => {
  return request(address)
    .patch(`/historics/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('patch /historics/:id', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'chat': chatTest._id,
      'user': userTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => request(address)
      .patch(`/historics/${response.body._id}`)
      .set('Authorization', tokenAuth)
      .send({
        'message': 'Olá, tudo bem? De onde você é?'
      }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.message).toBe('Olá, tudo bem? De onde você é?')
    })
    .catch(fail)
})

test('put /historics/aaaaa - not found', () => {
  return request(address)
    .put(`/historics/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('put /historics:/id', () => {
  return request(address)
    .post('/historics')
    .set('Authorization', tokenAuth)
    .send({
      'chat': chatTest._id,
      'user': userTest._id,
      'message': 'Olá, tudo bem?'
    })
    .then(response => request(address)
      .put(`/historics/${response.body._id}`)
      .set('Authorization', tokenAuth)
      .send({
        'chat': chatTest._id,
        'user': userTest._id,
        'message': 'Olá, tudo bem? Sou de Salvador'
      }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Olá, tudo bem? Sou de Salvador')
    }).catch(fail)
})
