package com.example.Cmms;

import com.example.Cmms.menu.EquipamentoMenu;
import com.example.Cmms.menu.OrdemServicoMenu;
import com.example.Cmms.menu.TecnicoMenu;
import org.springframework.stereotype.Component;

import java.util.Scanner;

@Component
public class Menu {

    public static void start() {
        Scanner scanner = new Scanner(System.in);

        while (true) {
            System.out.println("\n===== CMMS MENU =====");
            System.out.println("1 - Equipamentos");
            System.out.println("2 - Técnicos");
            System.out.println("3 - Ordens de Serviço");
            System.out.println("0 - Sair");

            int opcao = Integer.parseInt(scanner.nextLine());

            switch (opcao) {
                    case 1 -> EquipamentoMenu.menu(scanner);
                    case 2 -> TecnicoMenu.menu(scanner);
                    case 3 -> OrdemServicoMenu.menu(scanner);
                    case 0 -> {
                        System.out.println("Saindo...");
                        return;
                    }
                    default -> System.out.println("Opção inválida");
                }
            }
        }
    }