import 'jest'
import * as request from 'supertest'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment'

const address: string = (<any>global).address
let tokenAuth: string

beforeEach(() => {
  const token = jwt.sign({ sub: 'usuario@teste.com', iss: environment.security.iss }, environment.security.apiSecret)
  tokenAuth = `Bearer ${token}`
})

test('get /chats', () => {
  return request(address)
    .get('/chats')
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /chats', () => {
  return request(address)
    .post('/chats')
    .send({
      'chatName': 'chat01'
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.chatName).toBe('chat01')
    }).catch(fail)
})

test('post /chats - minimum allowed length (3)', () => {
  return request(address)
    .post('/chats')
    .send({
      'chatName': 'ch'
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeInstanceOf(Array)
      expect(response.body.errors[0].message).toContain('chatName')
      expect(response.body.errors[0].message).toContain('minimum allowed length (3)')
    }).catch(fail)
})

test('post /chats - chatName required', () => {
  return request(address)
    .post('/chats')
    .send({})
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeInstanceOf(Array)
      expect(response.body.errors[0].message).toContain('chatName')
    })
    .catch(fail)
})

test('get /chats/aaaaa - not found', () => {
  return request(address)
    .get('/chats/aaaaa')
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('get /chats/:id', () => {
  return request(address)
    .post('/chats')
    .send({
      'chatName': 'chat02'
    })
    .then(response => 
      request(address)
      .get(`/chats/${response.body._id}`)
      .set('Authorization',  tokenAuth))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.chatName).toBe('chat02')
    }).catch(fail)
})

test('delete /chats/aaaaa - not found', () => {
  return request(address)
    .delete(`/chats/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('delete /chats:/id', () => {
  return request(address)
    .post('/chats')
    .send({ 
      'chatName': 'chat03'
    })
    .then(response => 
      request(address)
      .delete(`/chats/${response.body._id}`)
      .set('Authorization', tokenAuth))
    .then(response => {
      expect(response.status).toBe(204)
    }).catch(fail)

})

test('patch /chats/aaaaa - not found', () => {
  return request(address)
    .patch(`/chats/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('post /chats - chatName duplicado', () => {
  return request(address)
    .post('/chats')
    .send({ 
      'chatName': 'chat01'
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.message).toContain('E11000 duplicate key')
    })
    .catch(fail)
})

test('patch /chats/:id', () => {
  return request(address)
    .post('/chats')
    .send({ 
      'chatName': 'chat04'
    })
    .then(response => request(address)
      .patch(`/chats/${response.body._id}`)
      .set('Authorization', tokenAuth)
      .send({ 
        'chatName': 'chat00004'
      }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.chatName).toBe('chat00004')
    })
    .catch(fail)
})

test('put /chats/aaaaa - not found', () => {
  return request(address)
    .put(`/chats/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('put /chats:/id', () => {
  return request(address)
    .post('/chats')
    .send({ 
      'chatName': 'chat05'
    }).then(response => request(address)
      .put(`/chats/${response.body._id}`)
      .set('Authorization', tokenAuth)
      .send({ 
        'chatName': 'chat00000005'
      }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.chatName).toBe('chat00000005')
    }).catch(fail)
})
