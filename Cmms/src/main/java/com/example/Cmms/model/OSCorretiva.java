package com.example.Cmms.model;

/**
 * OS Corretiva: prioridade aumenta com a criticidade e com falha total.
 * Regra: prioridade = (nivelCriticidade × 2) + (falhaTotal ? 10 : 0)
 */
public class OSCorretiva extends OrdemServico {

    private String  descricaoFalha;
    private boolean falhaTotal;
    private int     nivelCriticidade; // 1–4

    public OSCorretiva() {
        super();
        setTipo("CORRETIVA");
    }

    public OSCorretiva(Long equipamentoId, Long tecnicoId, String descricao, String setor,
                       String descricaoFalha, boolean falhaTotal, int nivelCriticidade) {
        super(equipamentoId, tecnicoId, descricao, setor);
        if (nivelCriticidade < 1 || nivelCriticidade > 4)
            throw new IllegalArgumentException("Nível de criticidade deve ser entre 1 e 4");
        this.descricaoFalha   = descricaoFalha;
        this.falhaTotal       = falhaTotal;
        this.nivelCriticidade = nivelCriticidade;
        setTipo("CORRETIVA");
    }

    @Override
    public int calcularPrioridade() {
        int prioridade = nivelCriticidade * 2;
        if (falhaTotal) prioridade += 10;
        return prioridade;
    }

    // ── Getters ────────────────────────────────────────────────────────────────
    public String  getDescricaoFalha()    { return descricaoFalha; }
    public boolean isFalhaTotal()         { return falhaTotal; }
    public int     getNivelCriticidade()  { return nivelCriticidade; }

    // ── Setters ────────────────────────────────────────────────────────────────
    public void setDescricaoFalha(String descricaoFalha)      { this.descricaoFalha = descricaoFalha; }
    public void setFalhaTotal(boolean falhaTotal)              { this.falhaTotal = falhaTotal; }
    public void setNivelCriticidade(int nivelCriticidade)     { this.nivelCriticidade = nivelCriticidade; }
}
