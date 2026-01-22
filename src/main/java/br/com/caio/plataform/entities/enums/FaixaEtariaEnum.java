package br.com.caio.plataform.entities.enums;

public enum FaixaEtariaEnum {
    L("Livre"),
    DEZ("10"),
    DOZE("12"),
    DEZESEIS("16"),
    DEZOITO("18");

    private final String descricao;

    FaixaEtariaEnum(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}