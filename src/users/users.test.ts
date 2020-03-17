import 'jest'
import * as request from 'supertest'
import * as jwt from 'jsonwebtoken'
import { environment } from '../common/environment'

const address: string = (<any>global).address
let tokenAuth: string
const dateNow: string  = new Date().toISOString()

beforeEach(() => {
  const token = jwt.sign({ sub: 'usuario@teste.com', iss: environment.security.iss }, environment.security.apiSecret)
  tokenAuth = `Bearer ${token}`
})

test('get /users', () => {
  return request(address)
    .get('/users')
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /users', () => {
  return request(address)
    .post('/users')
    .send({
      'nickName': 'thiagolobo1',
      'email': 'thiago@teste.com',
      'birthDay': dateNow
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.nickName).toBe('thiagolobo1')
      expect(response.body.email).toBe('thiago@teste.com')
      expect(response.body.birthDay).toBe(dateNow)
    }).catch(fail)
})

test('post /users - minimum allowed length (3)', () => {
  return request(address)
    .post('/users')
    .send({
      'nickName': 'th',
      'email': 'thiago@teste.com',
      'birthDay': dateNow
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeInstanceOf(Array)
      expect(response.body.errors[0].message).toContain('nickName')
      expect(response.body.errors[0].message).toContain('minimum allowed length (3)')
    }).catch(fail)
})

test('post /users - nickName required', () => {
  return request(address)
    .post('/users')
    .set('Authorization', tokenAuth)
    .send({
      'email': 'thiago1@teste.com',
      'birthDay': dateNow
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors).toBeInstanceOf(Array)
      expect(response.body.errors[0].message).toContain('nickName')
    })
    .catch(fail)
})

test('post /users - email and birthDay are not required', () => {
  return request(address)
    .post('/users')
    .set('Authorization', tokenAuth)
    .send({
      'nickName': 'thiagolobo2'
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.nickName).toBe('thiagolobo2')
    })
    .catch(fail)
})

test('get /users/aaaaa - not found', () => {
  return request(address)
    .get('/users/aaaaa')
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('get /users/:id', () => {
  return request(address)
    .post('/users')
    .send({
      'nickName': 'livia',
      'email': 'livia@teste.com',
      'birthDay': dateNow
    }).then(response => 
      request(address)
      .get(`/users/${response.body._id}`)
      .set('Authorization',  tokenAuth))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.nickName).toBe('livia')
      expect(response.body.email).toBe('livia@teste.com')
      expect(response.body.birthDay).toBe(dateNow)
    }).catch(fail)
})

test('delete /users/aaaaa - not found', () => {
  return request(address)
    .delete(`/users/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('delete /users:/id', () => {
  return request(address)
    .post('/users')
    .set('Authorization', tokenAuth)
    .send({
      'nickName': 'monique',
      'email': 'monique@teste.com',
      'birthDay': dateNow
    }).then(response => request(address)
      .delete(`/users/${response.body._id}`)
      .set('Authorization', tokenAuth))
    .then(response => {
      expect(response.status).toBe(204)
    }).catch(fail)

})

test('patch /users/aaaaa - not found', () => {
  return request(address)
    .patch(`/users/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

test('post /users - email duplicado', () => {
  return request(address)
    .post('/users')
    .send({
      'nickName': 'duplicado',
      'email': 'usuario@teste.com',
      'birthDay': dateNow
    })
    .then(response => {
      expect(response.status).toBe(400)
      expect(response.body.errors[0].message).toContain('E11000 duplicate key')
    })
    .catch(fail)
})

test('patch /users/:id', () => {
  return request(address)
    .post('/users')
    .send({
      'nickName': 'claudio',
      'email': 'claudio@teste.com',
      'birthDay': dateNow
    })
    .then(response => request(address)
      .patch(`/users/${response.body._id}`)
      .set('Authorization', tokenAuth)
      .send({
        'nickName': 'claudio santos'
      }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body._id).toBeDefined()
      expect(response.body.nickName).toBe('claudio santos')
      expect(response.body.email).toBe('claudio@teste.com')
      expect(response.body.birthDay).toBe(dateNow)
    })
    .catch(fail)
})

test('put /users/aaaaa - not found', () => {
  return request(address)
    .put(`/users/aaaaa`)
    .set('Authorization', tokenAuth)
    .then(response => {
      expect(response.status).toBe(404)
    }).catch(fail)
})

/*
  1. Cria-se um user com birthDay
  2. Atualiza, mas sem informar o birthDay
  3. Testa se o documento foi substituido -> birthDay undefined
*/
test('put /users:/id', () => {
  return request(address)
    .post('/users')
    .set('Authorization', tokenAuth)
    .send({
      'nickName': 'marines',
      'email': 'marines@teste.com',
      'birthDay': dateNow
    }).then(response => request(address)
      .put(`/users/${response.body._id}`)
      .set('Authorization', tokenAuth)
      .send({
        'nickName': 'marines',
        'email': 'marines@teste.com'
      }))
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.nickName).toBe('marines')
      expect(response.body.email).toBe('marines@teste.com')
      expect(response.body.birthDay).toBeUndefined()
    }).catch(fail)

})

test('authenticate user - not authorized', () => {
  return request(address)
    .post('/users/authenticate')
    .send({
      email: "xxxxx@email.com"
    })
    .then(response => {
      expect(response.status).toBe(403)
    }).catch(fail)
})

test('authenticate user', () => {
  return request(address)
    .post('/users/authenticate')
    .send({
      email: "usuario@teste.com"
    })
    .then(response => {
      expect(response.status).toBe(200)
      expect(response.body.accessToken).toBeDefined()
    }).catch(fail)
})
