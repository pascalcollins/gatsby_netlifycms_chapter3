const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem'); // createFilePath creates a url from a file's path

exports.onCreateNode = function({ node, getNode, actions}){
    const {createNodeField} = actions; // actions hat mehrere Funktionen, die auf Nodes angewandt werden können. createNodeField erlaubt es einem Node weitere Felder hinzuzufügen

    if (node.internal.type === 'MarkdownRemark') {
        const slug = createFilePath({node, getNode});
        createNodeField({
            node,
            name: 'slug',
            value: slug
        })
    }
};

exports.createPages = async function({ graphql, actions }) {
    const {createPage} = actions;

    const result = await graphql(`
        query {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `)

    result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
            path: node.fields.slug,
            component: path.resolve('./src/templates/blog.js'),
            context: {
                slug: node.fields.slug
            }
        });
    });
};