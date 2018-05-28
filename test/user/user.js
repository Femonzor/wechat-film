import crypto from "crypto";
import bcrypt from "bcrypt";
import should from "should";
import User from "../../app/models/user";
import app from "../../src/app2";

const getRandomString = len => {
    if (!len) len = 16;
    return crypto.randomBytes(Math.ceil(len / 2)).toString("hex");
};

let user;

describe("unit test", () => {
    describe("Model User:", () => {
        before(done => {
            user = {
                name: getRandomString(),
                password: "password"
            };
            done();
        });
        describe("Before Method save:", () => {
            it("should begin without test user", done => {
                User.find({ name: user.name }, (error, users) => {
                    users.should.have.length(0);
                    done();
                });
            });
        });
        describe("User save:", () => {
            it("should save with problems", done => {
                const userObj = new User(user);
                userObj.save(error => {
                    should.not.exist(error);
                    userObj.remove(error => {
                        should.not.exist(error);
                        done();
                    });
                });
            });
            it("should password be hashed correctly", done => {
                const password = user.password;
                const userObj = new User(user);
                userObj.save(error => {
                    should.not.exist(error);
                    userObj.password.should.not.have.length(0);
                    bcrypt.compare(password, userObj.password, (error, isMatch) => {
                        should.not.exist(error);
                        isMatch.should.equal(true);
                        userObj.remove(error => {
                            should.not.exist(error);
                            done();
                        });
                    });
                });
            });
            it("should have default role 0", done => {
                const userObj = new User(user);
                userObj.save(error => {
                    should.not.exist(error);
                    userObj.role.should.equal(0);
                    userObj.remove(error => {
                        should.not.exist(error);
                        done();
                    });
                });
            });
            it("should fail to save an existing user", done => {
                const user1 = new User(user);
                user1.save(error => {
                    should.not.exist(error);
                    const user2 = new User(user);
                    user2.save(error => {
                        console.log(`error: ${error}`);
                        should.exist(error);
                        user1.remove(error => {
                            if (!error) {
                                user2.remove(error => {
                                    done();
                                });
                            }
                        });
                    });
                });
            });
        });
        after(done => {
            done();
        });
    });
});
