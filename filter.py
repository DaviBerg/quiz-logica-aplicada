import pandas as pd
import re

# ==========================================
# FUNÇÕES AUXILIARES DE FORMATAÇÃO
# ==========================================

def formatar_life_span(valor):
    """Transforma 'yrs' para 'years' e 'mon' para 'month'."""
    if pd.isna(valor): 
        return ""
    return str(valor).replace("yrs", "years").replace("mon", "month")

def formatar_attributes(valor):
    """Seleciona as 5 primeiras características, separadas por vírgula e espaço."""
    if pd.isna(valor): 
        return ""
    # Divide pela vírgula (formato comum no CSV)
    atributos = str(valor).split(',')
    # Remove espaços extras nas pontas e pega os 5 primeiros
    atributos_limpos = [attr.strip() for attr in atributos if attr.strip()][:5]
    return ", ".join(atributos_limpos)

def formatar_diet(valor):
    """Formata a coluna Diet para que cada palavra seja separada por ', '."""
    if pd.isna(valor): 
        return ""
    # Usa expressão regular para encontrar todas as palavras isoladas (ignorando pontuações antigas)
    palavras = re.findall(r'\b\w+\b', str(valor))
    return ", ".join(palavras)

def escapar_prolog(valor):
    """
    Garante que aspas simples dentro das strings (ex: Jackson's) 
    não quebrem a sintaxe do átomo no Prolog.
    """
    return str(valor).replace("'", "''")

# ==========================================
# FUNÇÃO PRINCIPAL
# ==========================================

def processar_dados_animais(arquivo_entrada):
    # ---------------------------------------------------------
    # PASSO 1: Filtrar colunas específicas do CSV original
    # ---------------------------------------------------------
    colunas_desejadas = [
        'Name', 'Kingdom', 'Phylum', 'Class', 'Order', 
        'Family', 'Genus', 'Species', 'Life span', 'Attributes', 'Diet'
    ]
    
    df_original = pd.read_csv(arquivo_entrada)
    colunas_presentes = [col for col in colunas_desejadas if col in df_original.columns]
    df_passo1 = df_original[colunas_presentes]
    
    arquivo_passo1 = '1_colunas_filtradas.csv'
    df_passo1.to_csv(arquivo_passo1, index=False)
    print(f"Passo 1 concluído: '{arquivo_passo1}' gerado.")

    # ---------------------------------------------------------
    # PASSO 2: Manter apenas linhas com todos os campos preenchidos
    # ---------------------------------------------------------
    df_passo2_input = pd.read_csv(arquivo_passo1)
    df_passo2 = df_passo2_input.dropna(how='any')
    
    arquivo_passo2 = '2_linhas_completas.csv'
    df_passo2.to_csv(arquivo_passo2, index=False)
    print(f"Passo 2 concluído: '{arquivo_passo2}' gerado.")

    # ---------------------------------------------------------
    # PASSO 3: Contar ocorrências nas colunas de taxonomia
    # ---------------------------------------------------------
    df_passo3_input = pd.read_csv(arquivo_passo2)
    colunas_taxonomia = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus']
    arquivo_passo3 = '3_contagem_taxonomia.txt'
    
    with open(arquivo_passo3, 'w', encoding='utf-8') as f:
        for coluna in colunas_taxonomia:
            if coluna in df_passo3_input.columns:
                f.write(f"=== Contagem para a coluna: {coluna} ===\n")
                contagem = df_passo3_input[coluna].value_counts()
                for termo, quantidade in contagem.items():
                    f.write(f"{termo}: {quantidade}\n")
                f.write("\n")
                
    print(f"Passo 3 concluído: '{arquivo_passo3}' gerado.")

    # ---------------------------------------------------------
    # PASSO 4: Gerar fatos Prolog
    # ---------------------------------------------------------
    arquivo_passo4 = '4_fatos_animais.pl'
    
    with open(arquivo_passo4, 'w', encoding='utf-8') as f:
        for _, row in df_passo3_input.iterrows():
            # Extração padrão
            nome = escapar_prolog(row['Name'])
            reino = escapar_prolog(row['Kingdom'])
            filo = escapar_prolog(row['Phylum'])
            classe = escapar_prolog(row['Class'])
            ordem = escapar_prolog(row['Order'])
            familia = escapar_prolog(row['Family'])
            genero = escapar_prolog(row['Genus'])
            especie = escapar_prolog(row['Species'])

            # Aplicação das funções auxiliares
            life_span = escapar_prolog(formatar_life_span(row['Life span']))
            attributes = escapar_prolog(formatar_attributes(row['Attributes']))
            diet = escapar_prolog(formatar_diet(row['Diet']))

            # Construção do predicado. 
            # Note que envolvemos os valores em aspas simples ('') para que o Prolog os trate como átomos (strings).
            predicado = (
                f"animal('{nome}', '{reino}', '{filo}', '{classe}', '{ordem}', "
                f"'{familia}', '{genero}', '{especie}', '{life_span}', '{attributes}', '{diet}').\n"
            )
            f.write(predicado)

    print(f"Passo 4 concluído: '{arquivo_passo4}' gerado com os predicados Prolog.")

# Execução do programa
if __name__ == "__main__":
    nome_arquivo_original = 'animals_info.csv'
    processar_dados_animais(nome_arquivo_original)
