import re
import shutil
import unicodedata
from pathlib import Path


BASE = Path("z:/SagB")
AGENTES = BASE / "_ventures/dathex/agentes"
MASTER = AGENTES / "_triagem/Todos os agentes"


def norm(s: str) -> str:
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def parse_master(text: str):
    pattern = re.compile(r"^#\s+\d+\.\s+([^|\n]+)\|\s*([^\n]+)\n(.*?)(?=^---\s*$)", re.M | re.S)
    out = {}
    for m in pattern.finditer(text):
        name = m.group(1).strip()
        role = m.group(2).strip()
        body = m.group(3)

        f = re.search(r"Sua função é\s*(.+?)(?:\n\n|\n##)", body, re.S)
        func = " ".join(f.group(1).split()) if f else ""

        resp = []
        rm = re.search(r"##\s+Responsabilidades\s*(.+?)\n##\s+Formato de resposta", body, re.S)
        if rm:
            for line in rm.group(1).splitlines():
                line = line.strip()
                if line.startswith("* "):
                    item = line[2:].strip().rstrip(".")
                    if item:
                        resp.append(item)

        fmt = []
        fm = re.search(r"##\s+Formato de resposta\s*(.+?)\n\s*(?:---|$)", body, re.S)
        if fm:
            for line in fm.group(1).splitlines():
                line = line.strip()
                mm = re.match(r"\d+\.\s+(.+)", line)
                if mm:
                    fmt.append(mm.group(1).strip())

        out[norm(name)] = (name, role, func, resp, fmt)
    return out


REGRAS = [
    "nunca trabalhar sem entender o contexto recebido",
    "sempre validar a entrega anterior antes de continuar",
    "sempre apontar riscos, dúvidas e inconsistências",
    "nunca inventar informação ausente",
    "sempre gerar saída clara para o próximo agente",
    "sempre pensar em segurança, rastreabilidade e documentação",
    "sempre registrar o que foi feito, o que falta e o próximo passo",
    "se houver dúvida crítica, sinalizar antes de avançar",
    "toda entrega deve ser útil para execução real, não apenas texto bonito",
    "o objetivo final é contribuir para a criação de um MVP funcional",
]

ATIVACAO = """# prompt_ativacao_cline — {slug}

## regra canônica obrigatória

Antes de qualquer ação, este agente deve ler e obedecer integralmente:

1. `docs/governanca_sagb/padrao_unificado_governanca.md`
2. `docs/governanca_sagb/protocolo_log_continuo_agentes.md`
3. `docs/governanca_sagb/falas_user.md`

## ordem de leitura do agente

1. `agent/prompt_ativacao_cline.md`
2. `agent/persona.md`
3. `agent/session_log.md`
4. `agent/falas_user.md`

## estrutura obrigatória da pasta `agent`

A pasta deste agente deve conter apenas os 4 arquivos canônicos:

- `persona.md`
- `session_log.md`
- `falas_user.md`
- `prompt_ativacao_cline.md`

É proibido recriar `owner.md`, `history-chat.md`, `history_chat.md`, `session-log.md`, `prompt-ativacao-cline.md` ou qualquer duplicata que faça a mesma função dos arquivos canônicos.

## auto-log duplo obrigatório

Antes de responder ao usuário, o agente deve registrar:

1. conversa completa e literal em `agent/session_log.md`;
2. fala do usuário, literal e isolada, em `agent/falas_user.md`.

## literalidade

Não resumir, corrigir, reescrever ou interpretar a fala do usuário nos logs. Registrar exatamente como foi dito/escrito.

## fechamento obrigatório

Toda resposta final ao usuário deve terminar com a tag:

`[ 📝 Auto-log: OK ]`
"""


def main():
    text = MASTER.read_text(encoding="utf-8", errors="replace")
    master = parse_master(text)

    updated = []
    skipped = []

    for d in AGENTES.iterdir():
        if not d.is_dir() or d.name == "_triagem" or d.name == "matheu_rizzili_grb_eng_t_020":
            continue

        key = d.name.split("_grb_")[0]
        if key not in master:
            skipped.append(d.name)
            continue

        nome, papel, func, resp, fmt = master[key]

        lines = [
            "# persona",
            "",
            "## identidade",
            "",
            f"- nome_visual: {nome}",
            f"- papel: {papel} da Sala Dev Dathex",
            "",
            "## contexto",
            "",
            "A Sala Dev Dathex opera uma esteira de desenvolvimento orientada por agentes especializados para transformar ideias em MVPs funcionais, seguros, publicados, documentados e auditados.",
            "",
            "## responsabilidade principal",
            "",
            func.rstrip("."),
            "",
            "## escopo de atuação",
            "",
        ]

        for i, r in enumerate(resp, 1):
            lines.append(f"{i}. {r[:1].lower() + r[1:] if r else r}")

        lines += ["", "## formato de resposta", ""]
        for i, f in enumerate(fmt, 1):
            lines.append(f"{i}. {f[:1].lower() + f[1:] if f else f}")

        lines += ["", "## regras gerais", ""]
        for i, r in enumerate(REGRAS, 1):
            lines.append(f"{i}. {r}")

        (d / "persona.md").write_text("\n".join(lines).strip() + "\n", encoding="utf-8")
        (d / "prompt_ativacao_cline.md").write_text(ATIVACAO.format(slug=key), encoding="utf-8")
        updated.append(d.name)

    dup = AGENTES / "matheu_rizzili_grb_eng_t_020"
    removed = False
    if dup.exists() and dup.is_dir():
        shutil.rmtree(dup)
        removed = True

    print(f"UPDATED:{len(updated)}")
    for u in sorted(updated):
        print(u)
    print(f"SKIPPED:{len(skipped)}")
    for s in sorted(skipped):
        print(s)
    print(f"REMOVED_DUP:{removed}")


if __name__ == "__main__":
    main()

