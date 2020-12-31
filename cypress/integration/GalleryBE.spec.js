/// <reference types="Cypress" />

import { email, password, title, title1, description, description1} from '../fixtures/variables'
import { comment, image1, image2, token, galleryID, commentID } from '../fixtures/variables'

describe('Testing Backend', () => {

    let token;
    let galleryID;
    let commentID;
    
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
    
    it('Edit gallery', () => {
        cy.request({
            method: 'PUT',
            url: `/galleries/${galleryID}`,
            body:{"title": title1,
            "description": description1,
            "images":[image1, image2]},
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((resp) =>{
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('description').and.to.eq(description1);
            expect(resp.body).to.have.property('title').and.to.eq(title1);
        })
    })
    
    it('Adding comment', () => {
        cy.request({
            method: 'POST',
            url: '/comments',
            body: {
                "gallery_id": galleryID,
                "body": comment
            },
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body[0]).to.have.property('gallery_id').and.to.eq(galleryID);
            expect(resp.body[0]).to.have.property('id');
            commentID = resp.body[0].id;
        })
    })

    it('Deleting comment', () => {
        cy.request({
            method: 'DELETE',
            url: `/comments/${commentID}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((resp) => {
            expect(resp.status).to.eq(200);
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