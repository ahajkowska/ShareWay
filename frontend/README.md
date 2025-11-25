# Zbudowanie obrazu Dockera:
```cd frontend```
```docker build -t shareway-frontend .```

# Uruchomienie kontenera 
```docker run -p 3000:3000 --name test-frontend shareway-frontend```

Powinno działać w przeglądarce na: ```http://localhost:3000```

# Zobacz logi
```docker logs test-frontend```

# Zatrzymaj
```docker stop test-frontend```

# Usuń
```docker rm test-frontend```

# Zatrzymaj i usuń jedną komendą
```docker rm -f test-frontend```

# Jeśli build się nie powiedzie:

## Zobacz szczegóły błędu
```docker build -t shareway-frontend . --progress=plain```

## Usuń nieudany obraz
```docker rmi shareway-frontend```


# Usuń cache Dockera
docker builder prune -a

# Przebuduj
docker build -t shareway-frontend . --no-cache