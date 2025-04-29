#!/bin/sh

_replaceFrontendEnvVars() {
    echo "Procurando arquivos contendo vari�veis a serem substitu�das..."

    # Encontra todos os arquivos que cont�m as vari�veis ou URLs espec�ficas
    FILES=$(grep -rl "hours_ticket_close_auto\|https://api.example.com" /usr/src/app/build)

    if [ -z "$FILES" ]; then
        echo "Nenhum arquivo contendo as ocorr�ncias espec�ficas encontrado."
        exit 1
    fi

    for FILE in $FILES; do
        echo "Modificando $FILE..."

        # Escapar caracteres especiais nas vari�veis de ambiente
        ESCAPED_REACT_APP_HOURS_CLOSE_TICKETS_AUTO=$(printf '%s\n' "$REACT_APP_HOURS_CLOSE_TICKETS_AUTO" | sed 's:[\\/&]:\\&:g')
        ESCAPED_REACT_APP_BACKEND_URL=$(printf '%s\n' "$REACT_APP_BACKEND_URL" | sed 's:[\\/&]:\\&:g')

        # Substituir as vari�veis e URLs nos arquivos
        sed -i "s/hours_ticket_close_auto/${ESCAPED_REACT_APP_HOURS_CLOSE_TICKETS_AUTO}/g" "$FILE"
        sed -i "s|https://api.example.com|${ESCAPED_REACT_APP_BACKEND_URL}|g" "$FILE"

        echo "$FILE modificado com sucesso."
    done
}

_replaceFrontendEnvVars
