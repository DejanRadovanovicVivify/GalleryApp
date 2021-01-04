/// <reference types="Cypress" />

import { email, password, title, description, image1} from '../fixtures/variables'

describe('Testing Backend', () => {

    let token;
    let galleryID;
    let myGallery;

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

    it('Finding my gallery in all galleries', () => {
        cy.request({
            method: 'GET',
            url: '/galleries?page=1&term=',
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('galleries')
            resp.body.galleries.forEach(gallery => {
                if(gallery.title === title){
                    myGallery = gallery.title;
                }
            });
        })
    })

    it('Delete Gallery', () => {
        cy.request({
            method: 'DELETE',
            url: `https://gallery-api.vivifyideas.com/api/galleries/${galleryID}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((resp) => {
            expect(resp.status).to.eq(200);
        })
    })

})