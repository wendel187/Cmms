package com.example.Cmms.controller;

import com.example.Cmms.domain.equipamento.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/equipamento")
public class EquipamentoController {

    @Autowired
    private EquipamentoRepository repository;

    @PostMapping
    @Transactional
    public ResponseEntity cadastrarEquipamento(
            @RequestBody @Valid DadosCadastroEquipamento dados,
            UriComponentsBuilder uriBuilder) {

        var equipamento = new Equipamento(dados);
        repository.save(equipamento);
        var uri = uriBuilder
                .path("/equipamentos/{id}")
                .buildAndExpand(equipamento.getId())
                .toUri();

        var dto = new DadosDetalhamentoEquipamento(equipamento);
        return ResponseEntity.created(uri).body(dto);
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemEquipamento>> listarEquipamentos(
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = repository.findByStatus(Status.ATIVO, paginacao).map(DadosListagemEquipamento::new);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity listarEquipamentoPorId(@PathVariable Long id) {
        var equipamento = repository.getReferenceById(id);
        if (equipamento.getStatus() == Status.ATIVO) {
            return ResponseEntity.ok(new DadosDetalhamentoEquipamento(equipamento));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/setor/{setor}")
    public ResponseEntity listarEquipamentosPorSetor(@PathVariable String setor) {
        var equipamentos = repository.findBySetor(setor);
        var dto = equipamentos.stream()
                .map(DadosListagemEquipamento::new)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/criticidade/{criticidade}")
    public ResponseEntity<Page<DadosListagemEquipamento>> listarEquipamentosPorCriticidade(
            @PathVariable Criticidade criticidade,
            @PageableDefault(size = 10, sort = {"nome"}) Pageable paginacao) {
        var page = repository.findByCriticidade(criticidade, paginacao)
                .map(DadosListagemEquipamento::new);
        return ResponseEntity.ok(page);
    }

    @PutMapping
    @Transactional
    public ResponseEntity atualizarEquipamento(@RequestBody @Valid DadosAtualizacaoEquipamento dados) {
        var equipamento = repository.getReferenceById(dados.id());
        equipamento.atualizarInformacoes(dados);
        return ResponseEntity.ok(new DadosDetalhamentoEquipamento(equipamento));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity excluirEquipamento(@PathVariable Long id) {
        var equipamento = repository.getReferenceById(id);
        equipamento.excluir();
        return ResponseEntity.noContent().build();
    }


}