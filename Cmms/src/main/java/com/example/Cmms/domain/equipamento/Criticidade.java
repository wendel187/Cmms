package com.example.Cmms.domain.equipamento;

public enum Criticidade {
    BAIXA(1),
    MEDIA(2),
    ALTA(3),
    CRITICA(4);

    private final int nivel;

    Criticidade(int nivel) {
        this.nivel = nivel;
    }

    public int getNivel() {
        return nivel;
    }
}

