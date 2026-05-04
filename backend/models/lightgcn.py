import torch
import torch.nn as nn

class LightGCN(nn.Module):
    def __init__(self, num_users, num_items, emb_dim, num_layers):
        super().__init__()

        self.num_users = num_users
        self.num_items = num_items
        self.emb_dim = emb_dim
        self.num_layers = num_layers

        self.user_emb = nn.Embedding(num_users, emb_dim)
        self.item_emb = nn.Embedding(num_items, emb_dim)

        nn.init.xavier_uniform_(self.user_emb.weight)
        nn.init.xavier_uniform_(self.item_emb.weight)

    def forward(self, edge_index):
        emb = torch.cat([self.user_emb.weight, self.item_emb.weight])

        all_emb = [emb]

        for _ in range(self.num_layers):
            emb = torch.sparse.mm(edge_index, emb)
            all_emb.append(emb)

        final_emb = torch.mean(torch.stack(all_emb, dim=1), dim=1)

        user_final, item_final = torch.split(
            final_emb, [self.num_users, self.num_items]
        )

        return user_final, item_final