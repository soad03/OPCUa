const data=[
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:Alert:BOSH:feed-trigger-2",
        "type": "https://uri.fiware.org/ns/data-models#Alert"
    },
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:Alert:BOSH:feed-trigger-3",
        "type": "https://uri.fiware.org/ns/data-models#Alert"
    },
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:Alert:BOSH:feed-trigger-2321",
        "type": "https://uri.fiware.org/ns/data-models#Alert"
    },
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:Alert:BOSH:feed-trigger-12",
        "type": "https://uri.fiware.org/ns/data-models#Alert"
    },
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:Alert:BOSH:feed-trigger-45552",
        "type": "https://uri.fiware.org/ns/data-models#Alert"
    },
    {
        "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "id": "urn:ngsi-ld:Alert:BOSH:feed-trigger-4",
        "type": "https://uri.fiware.org/ns/data-models#Alert"
    },
]

const restult = data.map(o=>o.id.split('-')
                    .slice(-1)[0])
                    .map(l=>parseInt(l)).sort( (a,b) =>a - b )
                    .slice(-1)[0]
                    
console.log(restult);