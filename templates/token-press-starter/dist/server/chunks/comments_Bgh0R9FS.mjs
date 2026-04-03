globalThis.process ??= {};
globalThis.process.env ??= {};
import { C as CommentRepository } from "./comment_dXUVZELP.mjs";
async function handleCommentList(db, collection, contentId, options = {}) {
  try {
    const repo = new CommentRepository(db);
    const total = await repo.countByContent(collection, contentId, "approved");
    let publicItems;
    let nextCursor;
    if (options.threaded) {
      const MAX_THREADED = 500;
      const result = await repo.findByContent(collection, contentId, {
        status: "approved",
        limit: MAX_THREADED
      });
      const threaded = CommentRepository.assembleThreads(result.items);
      publicItems = threaded.map((c) => CommentRepository.toPublicComment(c));
    } else {
      const result = await repo.findByContent(collection, contentId, {
        status: "approved",
        limit: options.limit,
        cursor: options.cursor
      });
      publicItems = result.items.map((c) => CommentRepository.toPublicComment(c));
      nextCursor = result.nextCursor;
    }
    return {
      success: true,
      data: {
        items: publicItems,
        nextCursor,
        total
      }
    };
  } catch (error) {
    console.error("Comment list error:", error);
    return {
      success: false,
      error: {
        code: "COMMENT_LIST_ERROR",
        message: "Failed to list comments"
      }
    };
  }
}
async function handleCommentInbox(db, options = {}) {
  try {
    const repo = new CommentRepository(db);
    const status = options.status ?? "pending";
    const result = await repo.findByStatus(status, {
      collection: options.collection,
      search: options.search,
      limit: options.limit,
      cursor: options.cursor
    });
    return {
      success: true,
      data: {
        items: result.items,
        nextCursor: result.nextCursor
      }
    };
  } catch (error) {
    console.error("Comment inbox error:", error);
    return {
      success: false,
      error: {
        code: "COMMENT_INBOX_ERROR",
        message: "Failed to list comments"
      }
    };
  }
}
async function handleCommentCounts(db) {
  try {
    const repo = new CommentRepository(db);
    const counts = await repo.countByStatus();
    return { success: true, data: counts };
  } catch (error) {
    console.error("Comment counts error:", error);
    return {
      success: false,
      error: {
        code: "COMMENT_COUNTS_ERROR",
        message: "Failed to get comment counts"
      }
    };
  }
}
async function handleCommentGet(db, id) {
  try {
    const repo = new CommentRepository(db);
    const comment = await repo.findById(id);
    if (!comment) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Comment not found: ${id}` }
      };
    }
    return { success: true, data: comment };
  } catch (error) {
    console.error("Comment get error:", error);
    return {
      success: false,
      error: {
        code: "COMMENT_GET_ERROR",
        message: "Failed to get comment"
      }
    };
  }
}
async function handleCommentDelete(db, id) {
  try {
    const repo = new CommentRepository(db);
    const deleted = await repo.delete(id);
    if (!deleted) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: `Comment not found: ${id}` }
      };
    }
    return { success: true, data: { deleted: true } };
  } catch (error) {
    console.error("Comment delete error:", error);
    return {
      success: false,
      error: {
        code: "COMMENT_DELETE_ERROR",
        message: "Failed to delete comment"
      }
    };
  }
}
async function handleCommentBulk(db, ids, action) {
  try {
    const repo = new CommentRepository(db);
    let affected;
    if (action === "delete") {
      affected = await repo.bulkDelete(ids);
    } else {
      const statusMap = {
        approve: "approved",
        spam: "spam",
        trash: "trash"
      };
      affected = await repo.bulkUpdateStatus(ids, statusMap[action]);
    }
    return { success: true, data: { affected } };
  } catch (error) {
    console.error("Comment bulk error:", error);
    return {
      success: false,
      error: {
        code: "COMMENT_BULK_ERROR",
        message: "Failed to perform bulk operation"
      }
    };
  }
}
async function checkRateLimit(db, ipHash, maxPerWindow = 5, windowMinutes = 10) {
  const cutoff = new Date(Date.now() - windowMinutes * 60 * 1e3).toISOString();
  const result = await db.selectFrom("_emdash_comments").select((eb) => eb.fn.count("id").as("count")).where("ip_hash", "=", ipHash).where("created_at", ">", cutoff).executeTakeFirst();
  const count = Number(result?.count ?? 0);
  return count >= maxPerWindow;
}
async function hashIp(ip, salt = "emdash-ip-salt") {
  const data = `ip:${salt}:${ip}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}
export {
  handleCommentCounts as a,
  handleCommentGet as b,
  handleCommentDelete as c,
  handleCommentInbox as d,
  handleCommentList as e,
  hashIp as f,
  checkRateLimit as g,
  handleCommentBulk as h
};
