import {ADMIN_ROLE, USER_ROLE} from "./userRoles.js";

const mockUsers =
    [
        {
            username: "test@test.test",
            hashedPassword: "$2a$12$qONcEvbWaVuBBBjZjy66Xu7n2t2v08DvTh1/w0vBjTniEU59MjCga",
            role: ADMIN_ROLE
        },
        {
            username: "patient@fysio.nl",
            hashedPassword: " $2a$10$HsDwuBB9kKHO1hx2jUnnluyN6mZnAzKg1ZXth.A9CgN2JR4SBPhQ.",
            role: USER_ROLE
        },
        {
            username: "admin@fysio.nl",
            hashedPassword: " $2a$10$rrtWNEvtQQRrtf3c7fR7HOYzZHbhFS.zJsry0PjnoXC.SPKmLJEcG",
            role: ADMIN_ROLE
        }
    ]

export {mockUsers};

