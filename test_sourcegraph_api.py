import os
import requests
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env
load_dotenv()

# Obter o token da variável de ambiente
token = os.environ.get('SOURCEGRAPH_API_TOKEN')

if not token:
    print("Erro: Token não encontrado. Verifique seu arquivo .env")
    exit(1)

# Imprimir os primeiros e últimos 5 caracteres do token para verificação
print(f"Usando token: {token[:5]}...{token[-5:] if len(token) > 10 else ''}")

# Configurar a requisição - note o formato exato do cabeçalho
headers = {'Authorization': f'token {token}'}
query = {"query": "query { currentUser { username } }"}

# Fazer a requisição para a API com mais informações de debug
try:
    print("Enviando requisição para a API do Sourcegraph...")
    response = requests.post('https://sourcegraph.com/.api/graphql', 
                            json=query, 
                            headers=headers)
    
    print(f"Status code: {response.status_code}")
    
    # Verificar se a requisição foi bem-sucedida
    response.raise_for_status()
    
    # Exibir o resultado
    result = response.json()
    print("Conexão bem-sucedida!")
    print(f"Resposta completa: {result}")
    print(f"Usuário atual: {result.get('data', {}).get('currentUser', {}).get('username', 'N/A')}")
    
except requests.exceptions.RequestException as e:
    print(f"Erro ao conectar com a API do Sourcegraph: {e}")
    if hasattr(e, 'response') and e.response:
        print(f"Detalhes da resposta: {e.response.text}")