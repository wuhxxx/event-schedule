const { PORT, BASE_API_ROUTE } = require("../config/serverConfig.js");
const {
    Unauthorized,
    InvalidToken,
    EmailRegistered,
    UserNotFound,
    WrongPassword,
    EventNotFound
} = require("../util/errorTypes.js");
const expect = require("chai").expect,
    supertest = require("supertest"),
    api = supertest(`http://localhost:${PORT}`);

// should = require("chai").should()

const username = "test",
    email = "test@t.c",
    password = "test",
    event = {
        title: "title",
        startAt: 100,
        endAt: 200,
        weekday: 4,
        description: "des",
        color: 1000
    },
    eventNewTitle = "update";

let jwtToken, eventId;

/** Sign up */
describe(`POST ${BASE_API_ROUTE}/users/signup`, () => {
    it("Expect status code 200 and a json response body", done => {
        api.post(`${BASE_API_ROUTE}/users/signup`)
            .set("Accept", "application/json")
            .send({
                username: username,
                email: email,
                password: password
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("username");
                expect(res.body.data.username).to.equal(username);
                expect(res.body.data).to.have.property("token");
                expect(res.body.data).to.have.property("expiresIn");
                done();
            });
    });

    it("Expect status code 409 EmailRegistered error as signup using same email'", done => {
        api.post(`${BASE_API_ROUTE}/users/signup`)
            .set("Accept", "application/json")
            .send({
                username: username,
                email: email,
                password: password
            })
            .expect(409)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(EmailRegistered.errorName);
                done();
            });
    });
});

/** Log in */
describe(`POST ${BASE_API_ROUTE}/users/login`, () => {
    it("Expect jwt token as user successfully log in", done => {
        api.post(`${BASE_API_ROUTE}/users/login`)
            .set("Accept", "application/json")
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("username");
                expect(res.body.data).to.have.property("token");
                expect(res.body.data).to.have.property("expiresIn");
                jwtToken = res.body.data.token;
                done();
            });
    });

    it("Expect status code 400 WrongPassword error when using wrong password", done => {
        api.post(`${BASE_API_ROUTE}/users/login`)
            .set("Accept", "application/json")
            .send({
                email: email,
                password: "incorrect"
            })
            .expect(400)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(WrongPassword.errorName);
                done();
            });
    });
});

/** Add event */
describe(`POST ${BASE_API_ROUTE}/events/`, () => {
    it("Expect status code 401 Unauthorized error when 'Authorization' header not set", done => {
        api.post(`${BASE_API_ROUTE}/events`)
            .set("Accept", "application/json")
            .send(event)
            .expect(401)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(Unauthorized.errorName);
                done();
            });
    });

    it("Expect status code 401 and InvalidToken error when using invalid token", done => {
        const invalidToken = "invalidtoken0987654321";
        api.post(`${BASE_API_ROUTE}/events`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${invalidToken}`)
            .send(event)
            .expect(401)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(InvalidToken.errorName);
                done();
            });
    });

    it("Expect stattus code 400 and validation error when missing required field of an event", done => {
        const eventMissingOneField = Object.assign({}, event);
        delete eventMissingOneField.weekday;
        api.post(`${BASE_API_ROUTE}/events`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(eventMissingOneField)
            .expect(400)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal("ValidationError");
                done();
            });
    });

    it("Expect id of event that added to test account", done => {
        api.post(`${BASE_API_ROUTE}/events`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send(event)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("eventId");
                eventId = res.body.data.eventId;
                done();
            });
    });
});

/** Retrieve user's events */
describe(`GET ${BASE_API_ROUTE}/events/all`, () => {
    it("Expect status code 401 Unauthorized error when 'Authorization' header not set", done => {
        api.get(`${BASE_API_ROUTE}/events/all`)
            .set("Accept", "application/json")
            .expect(401)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(Unauthorized.errorName);
                done();
            });
    });

    it("Expect user's event array, now has length 1", done => {
        api.get(`${BASE_API_ROUTE}/events/all`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${jwtToken}`)
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("events");
                expect(res.body.data.events).to.have.lengthOf(1);
                expect(res.body.data.events[0].title).to.equal(event.title);
                done();
            });
    });
});

/** Update exisiting event */
describe(`PATCH ${BASE_API_ROUTE}/events/:eventId`, () => {
    it("Expect stattus code 400 and validation error as body for update includes unexpect field", done => {
        const data = {};
        data.unexpect = 1;
        api.patch(`${BASE_API_ROUTE}/events/${eventId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ data })
            .expect(400)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal("ValidationError");
                done();
            });
    });

    it("Expect status code 404 and EventNotFound error when requesting non-existing event", done => {
        const nonExistEventId = "000000000000000000000000";
        api.patch(`${BASE_API_ROUTE}/events/${nonExistEventId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ data: {} })
            .expect(404)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(EventNotFound.errorName);
                done();
            });
    });

    it("Expect a updated event object in response body as event be successfully updated", done => {
        api.patch(`${BASE_API_ROUTE}/events/${eventId}`)
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ data: { title: eventNewTitle } })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("updatedEvent");
                expect(res.body.data.updatedEvent.title).to.equal(
                    eventNewTitle
                );
                done();
            });
    });
});

/** Delete exisiting event */
describe(`DELETE ${BASE_API_ROUTE}/events`, () => {
    it("");
});

/** Delete user's account */
describe(`DELETE ${BASE_API_ROUTE}/users/`, () => {
    it("Expect deletion of test account", done => {
        api.delete(`${BASE_API_ROUTE}/users`)
            .set("Accept", "application/json")
            .send({
                email: email
            })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("data");
                expect(res.body.data).to.have.property("deletedUser");
                expect(res.body.data).to.have.property("deletedEventsId");
                expect(res.body.data.deletedUser).to.equal(email);
                expect(res.body.data.deletedEventsId).to.have.lengthOf(1);
                done();
            });
    });

    it("Expect status 404 UserNotFound error if log in again", done => {
        api.post(`${BASE_API_ROUTE}/users/login`)
            .set("Accept", "application/json")
            .send({
                email: email,
                password: password
            })
            .expect(404)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body).to.have.property("error");
                expect(res.body.error).to.have.property("code");
                expect(res.body.error).to.have.property("name");
                expect(res.body.error).to.have.property("message");
                expect(res.body.error.name).to.equal(UserNotFound.errorName);
                done();
            });
    });
});
