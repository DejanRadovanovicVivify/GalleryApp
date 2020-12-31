/// <reference types="Cypress" />

import { email, password, title, title1, description, description1} from '../fixtures/variables'
import { comment, image1, image2, token, galleryID, commentID } from '../fixtures/variables'

describe('Testing Backend', () => {

    let token;
    let galleryID;

    it('Login Backend', () => {
        cy.request({
            method: 'POST',
            url:'/auth/login',
            body: {
                "email": email,
                "password": password,  
            }
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('access_token');
            expect(resp.body).to.have.property('token_type').and.to.eq('bearer')
            //localStorage.setItem('token', resp.body.access_token);
            token = resp.body.access_token;
        })
    })

    it('Creating Gallery Backend', () => {
        cy.request({
            method: 'POST',
            url: '/galleries',
            body: {
                "title": title,
                "description": description,
                "images":[image1]
            },
            headers: {
                authorization: `Bearer ${token}`
            } 
        }).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body).to.have.property('description').and.to.eq(description);
            expect(resp.body).to.have.property('title').and.to.eq(title);
            galleryID = resp.body.id;
        })
    })

    it.only('Finding my gallery in all galleries', () => {
        cy.request({
            method: 'GET',
            url: '/galleries?page=1&term=',
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('galleries')
        })
    })

    // it('Finding my gallery in all galleries', () => {
    //     cy.request
    // })

    // it('Delete Gallery', () => {
    //     cy.request({
    //         method: 'DELETE',
    //         url: `https://gallery-api.vivifyideas.com/api/galleries/${galleryID}`,
    //         headers: {
    //             authorization: `Bearer ${token}`
    //         }
    //     }).then((resp) => {
    //         expect(resp.status).to.eq(200);
    //     })
    // })

})