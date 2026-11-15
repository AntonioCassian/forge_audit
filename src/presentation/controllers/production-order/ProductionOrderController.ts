
import type { Request, Response } from "express";

import type { UpdateProductionOrderStatusUseCase } from "../../../core/use-cases/produto_order/update-producto-order.js";
import type { GetProductionOrderByIdUseCase } from "../../../core/use-cases/produto_order/get_production_order_byid_use_case.js";
import type { GetAllProductionOrdersUseCase } from "../../../core/use-cases/produto_order/getall_production_orders_usecase.js";
import type { DeleteProductionOrderUseCase } from "../../../core/use-cases/produto_order/delete_production_order_use_case.js";
import type { CreateProductionOrderUseCase } from "../../../core/use-cases/produto_order/CreateProductionOrderUseCase.js";
import type { CreateAuditLogUseCase } from "../../../core/use-cases/audit/create-audit-log.js";

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    name: string;
    role: "OPERATOR" | "SUPERVISOR" | "AUDITOR";
  };
};

export class ProductionOrderController {
  constructor(
    private createProductionOrderUseCase: CreateProductionOrderUseCase,
    private updateProductionOrderStatusUseCase: UpdateProductionOrderStatusUseCase,
    private getProductionOrderByIdUseCase: GetProductionOrderByIdUseCase,
    private getAllProductionOrdersUseCase: GetAllProductionOrdersUseCase,
    private deleteProductionOrderUseCase: DeleteProductionOrderUseCase,
    private createAuditLogUseCase: CreateAuditLogUseCase
  ) {}

  // ========================================
  // CREATE PRODUCTION ORDER
  // ========================================

  async create(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const productionOrder =
        await this.createProductionOrderUseCase.execute(req.body);

      await this.createAuditLogUseCase.execute({
        userId: req.user.id,
        userName: req.user.name,
        role: req.user.role,
        sourceIp: req.ip ?? "",
        action: "CREATE",
        affectedEntity: "ordem_producao",
        affectedRecordId: productionOrder.id,
        newData: {
          productionCode: productionOrder.productionCode,
          machineId: productionOrder.machineId,
          plannedQuantity: productionOrder.plannedQuantity,
          producedQuantity: productionOrder.producedQuantity,
          status: productionOrder.status,
        },
      });

      return res.status(201).json({
        message: "Ordem de produção criada com sucesso.",
        productionOrder,
      });

    } catch (error) {
      console.error("Erro ao criar ordem de produção:", error);

      return res.status(400).json({
        message: error instanceof Error
          ? error.message
          : "Erro ao criar ordem.",
      });
    }
  }

  // ========================================
  // FIND PRODUCTION ORDER BY ID
  // ========================================

  async findById(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          error: "Um ID válido da ordem de produção é obrigatório.",
        });
      }

      const productionOrder =
        await this.getProductionOrderByIdUseCase.execute(id);

      return res.status(200).json(productionOrder);

    } catch (error) {
      return res.status(404).json({
        message: error instanceof Error
          ? error.message
          : "Erro ao buscar ordem.",
      });
    }
  }

  // ========================================
  // FIND ALL PRODUCTION ORDERS
  // ========================================

  async findAll(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const productionOrders =
        await this.getAllProductionOrdersUseCase.execute();

      return res.status(200).json(productionOrders);

    } catch (error) {
      console.error("Erro ao listar ordens:", error);

      return res.status(500).json({
        message: "Erro ao listar ordens de produção.",
      });
    }
  }

  // ========================================
  // UPDATE PRODUCTION ORDER STATUS
  // ========================================

  async updateStatus(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          error: "Um ID válido da ordem de produção é obrigatório.",
        });
      }

      const validStatuses = [
        "PLANNED",
        "IN_PROGRESS",
        "SUSPENDED",
        "COMPLETED",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Status de ordem de produção inválido.",
        });
      }

      const previousOrder =
        await this.getProductionOrderByIdUseCase.execute(id);

      if (previousOrder.status === status) {
        return res.status(200).json({
          message: "A ordem já possui esse status.",
          productionOrder: previousOrder,
        });
      }

      await this.updateProductionOrderStatusUseCase.execute({
        productionOrderId: id,
        status,
      });

      const updatedOrder =
        await this.getProductionOrderByIdUseCase.execute(id);

      await this.createAuditLogUseCase.execute({
        userId: req.user.id,
        userName: req.user.name,
        role: req.user.role,
        sourceIp: req.ip ?? "",
        action: "UPDATE",
        affectedEntity: "ordem_producao",
        affectedRecordId: id,
        previousData: {
          status: previousOrder.status,
        },
        newData: {
          status: updatedOrder.status,
        },
      });

      return res.status(200).json({
        message: "Status atualizado com sucesso.",
        productionOrder: updatedOrder,
      });

    } catch (error) {
      console.error("Erro ao atualizar status:", error);

      return res.status(400).json({
        message: error instanceof Error
          ? error.message
          : "Erro ao atualizar status.",
      });
    }
  }

  // ========================================
  // DELETE PRODUCTION ORDER
  // ========================================

  async delete(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;

      if (typeof id !== "string" || !id.trim()) {
        return res.status(400).json({
          error: "Um ID válido da ordem de produção é obrigatório.",
        });
      }

      const previousOrder =
        await this.getProductionOrderByIdUseCase.execute(id);

      await this.deleteProductionOrderUseCase.execute(id);

      await this.createAuditLogUseCase.execute({
        userId: req.user.id,
        userName: req.user.name,
        role: req.user.role,
        sourceIp: req.ip ?? "",
        action: "DELETE",
        affectedEntity: "ordem_producao",
        affectedRecordId: id,
        previousData: {
          productionCode: previousOrder.productionCode,
          machineId: previousOrder.machineId,
          plannedQuantity: previousOrder.plannedQuantity,
          producedQuantity: previousOrder.producedQuantity,
          status: previousOrder.status,
        },
      });

      return res.status(200).json({
        message: "Ordem de produção excluída com sucesso.",
      });

    } catch (error) {
      console.error("Erro ao excluir ordem:", error);

      return res.status(400).json({
        message: error instanceof Error
          ? error.message
          : "Erro ao excluir ordem.",
      });
    }
  }
}
