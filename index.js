const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const websites = [
    {
        name: 'marketwatch',
        address: 'https://www.marketwatch.com/investing/cryptocurrency'
    },
    {
        name: 'economist',
        address: 'https://www.economist.com/finance-and-economics'
    },
    {
        name: 'ft',
        address: 'https://www.ft.com/cryptocurrencies'
    },
    {
        name: 'cnn',
        address: 'https://www.cnn.com/business'
    },
    {
        name: 'wsj',
        address: 'https://www.wsj.com/search?query=CRYPTOCURRENCY&mod=searchresults_viewallresults'
    },
    {
        name: 'cointelegraph',
        address: 'https://cointelegraph.com/category/market-analysis'
    },
    {
        name: 'bitcoinmagazine',
        address: 'https://bitcoinmagazine.com/articles'
    },
    {
        name: 'todayonchain',
        address: 'https://www.todayonchain.com/news/'
    },
    {
        name: 'newsbtc',
        address: 'https://www.newsbtc.com/analysis/'
    },
    {
        name: 'bitcoinsit',
        address: 'https://bitcoinist.com/trade/'
    },
    {
        name: 'forbes',
        address: 'https://www.forbes.com/crypto-blockchain/?sh=5385d0642b6e'
    },
] 
const articles = []

websites.forEach(website => {
    axios.get(website.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Crypto")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                     title,
                     url,
                     source: website.name
                  })
            })



        }).catch(err => console.log(err))
})

app.get('/', (req,res) => {
    res.json('Welcome to my home page!')
})


app.get('/news', (req, res) => {
    res.json(articles)
})


app.get('/news/:websiteId', (req, res) => {
    const websiteID = req.params.websiteId
    const websiteAddress = websites.filter(website => website.name == websiteID)[0].address

    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Crypto")', html).each(function () {
               const title = $(this).text()
               const url =   $(this).attr('href')
                specificArticles.push({
                    title,
                    url,
                    source: websiteID
                 })

            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
    
})

app.listen(PORT, ()=> console.log(`Server is running on PORT ${PORT}`))