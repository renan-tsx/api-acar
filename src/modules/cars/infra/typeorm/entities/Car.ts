import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Category } from "./Category";
import { Specification } from "./Specification";

/** NOTE Typeorm
 * Fornece uma coleção para a entidade
 */

@Entity("cars")
class Car {

  @PrimaryColumn()
  id: string;
  
  @Column()
  name: string;
  
  @Column()
  description: string;
  
  @Column()
  daily_rate: number;
  
  @Column()
  license_plate: string;
  
  @Column()
  fine_amount: number;
  
  @Column()
  brand: string;

  /**
   * @JoinColumn({ name: "category_id"}) especifica que a coluna "category_id"
   * na tabela atual é a chave estrangeira que referencia a tabela "Category".
   * 
   * @ManyToOne(() => Category) especifica que a entidade atual tem uma relação 
   * muitos-para-um com a entidade "Category".
   */

  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id"})
  category: Category;

  /**
   * @ManyToMany(() => Specificatio indicar que existe um relacionamento 
   * muitos-para-muitos entre a entidade atual (que contém o relacionamento)
   * a entidade Specification
   * 
   * @ JoinTables  é usado para especificar a tabela intermediária que será 
   * usada para armazenar o relacionamento. No exemplo, a tabela intermediária 
   * é chamada de "specifications_cars" e possui duas colunas que apontam para 
   * as chaves primárias das entidades envolvidas. A coluna "car_id" faz 
   * referência à chave primária da entidade "Car" e "specification_id" faz 
   * referência à chave primária da entidade "Specification".
   * 
   * Por fim, a propriedade specification é definida como um array de 
   * Specification que contém as entidades relacionadas.
   */

  @ManyToMany(() => Specification)
  @JoinTable({ 
    name: "specifications_cars",
    joinColumns: [{ name: "car_id"}],
    inverseJoinColumns: [{name: "specification_id"}]
  })
  specifications: Specification[];
  
  @Column()
  category_id: string;

  @Column()
  available: boolean;
  
  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if(!this.id) {
      this.id = uuidv4();
      this.available = true;
    }
  }
}

export { Car };
