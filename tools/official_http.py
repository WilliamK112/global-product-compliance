"""Official-source HTTP adapter. No scraping of seller backends."""


def allowed(url: str) -> bool:
    hosts = (
        "eur-lex.europa.eu",
        "www.ecfr.gov",
        "www.cpsc.gov",
        "www.fda.gov",
        "notifkos.pom.go.id",
        "sertifikasi.postel.go.id",
        "bsn.go.id",
        "seller.alibaba.com",
        "m.media-amazon.com",
    )
    return any(host in url for host in hosts)
