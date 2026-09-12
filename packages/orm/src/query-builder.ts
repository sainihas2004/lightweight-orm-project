export interface Query {
  text: string;
  values: unknown[];
}

export function buildInsert(
  table: string,
  data: Record<string, unknown>
): Query {
  const columns = Object.keys(data);

  const placeholders = columns.map(
    (_, index) => `$${index + 1}`
  );

  const values = columns.map(
    (column) => data[column]
  );

  const text = `
    INSERT INTO ${table}
    (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *
  `;

  return {
    text,
    values
  };
}


export function buildSelect(
  table: string,
  where?: Record<string, unknown>
): Query {
  const values: unknown[] = [];

  let text = `SELECT * FROM ${table}`;

  if (where && Object.keys(where).length > 0) {

    const conditions = Object.entries(where).map(
      ([column, value], index) => {

        values.push(value);

        return `${column} = $${index + 1}`;
      }
    );

    text += ` WHERE ${conditions.join(" AND ")}`;
  }

  return {
    text,
    values
  };
}


export function buildUpdate(
  table: string,
  id: number,
  data: Record<string, unknown>
): Query {
  const columns = Object.keys(data);

  const values = columns.map(
    (column) => data[column]
  );

  const updates = columns.map(
    (column, index) =>
      `${column} = $${index + 1}`
  );

  values.push(id);

  const text = `
    UPDATE ${table}
    SET ${updates.join(", ")}
    WHERE id = $${values.length}
    RETURNING *
  `;

  return {
    text,
    values
  };
}


export function buildDelete(
  table: string,
  id: number
): Query {
  return {
    text: `DELETE FROM ${table} WHERE id = $1 RETURNING *`,
    values: [id]
  };
}