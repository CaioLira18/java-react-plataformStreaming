package br.com.caio.plataform.entities.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FaixaEtariaEnum {
    L("L"),
    DEZ("10"),
    DOZE("12"),
    DEZESEIS("16"),
    DEZOITO("18");

    private final String descricao;

    FaixaEtariaEnum(String descricao) {
        this.descricao = descricao;
    }

    @JsonValue
    public String getDescricao() {
        return descricao;
    }

    public static FaixaEtariaEnum fromString(String texto) {
        for (FaixaEtariaEnum fe : FaixaEtariaEnum.values()) {
            if (fe.descricao.equalsIgnoreCase(texto)) {
                return fe;
            }
        }
        throw new IllegalArgumentException("Faixa etária inválida: " + texto);
    }
}