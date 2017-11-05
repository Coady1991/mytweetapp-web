'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('User API tests', function () {

  test('get users', function () {

    const url = 'http://localhost:4000/api/users';
    var res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));

    assert.equal(2, users.length);

    assert.equal(users[0].firstName, 'Homer');
    assert.equal(users[0].lastName, 'Simpson');
    assert.equal(users[0].email, 'homer@simpson.com');
    assert.equal(users[0].password, 'secret');

    assert.equal(users[1].firstName, 'Bart');
    assert.equal(users[1].lastName, 'Simpson');
    assert.equal(users[1].email, 'bart@simpson.com');
    assert.equal(users[1].password, 'secret');

  });

  test('get one user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    var res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = allUsersUrl + '/' + users[0]._id;
    res = request('GET', oneUserUrl);
    const oneUser = JSON.parse(res.getBody('utf8'));

    assert.equal(oneUser.firstName, 'Homer');
    assert.equal(oneUser.lastName, 'Simpson');
    assert.equal(oneUser.email, 'homer@simpson.com');
    assert.equal(oneUser.password, 'secret');

  });

  test('create a user', function () {

    const usersUrl = 'http://localhost:4000/api/users';
    const newUser = {
      firstName: 'Marge',
      lastName: 'Simpson',
      email: 'marge@simpson.com',
      password: 'secret',
    };

    const res = request('POST', usersUrl, { json: newUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'Marge');
    assert.equal(returnedUser.lastName, 'Simpson');
    assert.equal(returnedUser.email, 'marge@simpson.com');
    assert.equal(returnedUser.password, 'secret');

  });

  test('delete a user', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    const res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    const deleteUserUrl = allUsersUrl + '/' + users[0]._id;
    request('DELETE', deleteUserUrl);

    const userList = JSON.parse(request('GET', 'http://localhost:4000/api/users').getBody('utf8'));

    assert.equal(2, userList.length);

  });

  test('delete all users', function () {

    const allUsersUrl = 'http://localhost:4000/api/users';
    const res = request('GET', allUsersUrl);
    const users = JSON.parse(res.getBody('utf8'));

    request('DELETE', allUsersUrl);

    const userList = JSON.parse(request('GET', 'http://localhost:4000/api/users').getBody('utf8'));

    assert.equal(0, userList.length);

  });
});
